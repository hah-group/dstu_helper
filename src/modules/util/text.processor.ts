import { Lesson } from '../lesson/lesson.entity';
import * as moment from 'moment';
import { DateTime, Time } from './time';
import { StudyGroup } from '../study-group/study-group.entity';
import { LessonGroupProcessor } from './lesson-group/lesson-group.processor';
import {
  LessonGroupClassRoom,
  LessonGroupMultiply,
  LessonGroupResult,
  LessonGroupSingle,
  LessonGroupSingleManyClassRooms,
} from './lesson-group/lesson-group.type';
import * as lodash from 'lodash';
import { i18nReplacements, localization } from './localization';
import { TimeRelativeProcessor } from './time-relative.processor';
import { DATE_REGEX_BODY, FULL_DATE_REGEX_BODY, MNEMONIC_REGEX_BODY } from './date.parser';
import { Logger } from '@nestjs/common';
import { BumpedGroupsResult } from '../dstu/dstu.service';

const ANY_DATE = `${MNEMONIC_REGEX_BODY}|${DATE_REGEX_BODY}|${FULL_DATE_REGEX_BODY}`;

export const SCHEDULE_ACTIVATION = new RegExp(`^расписание( пар)?(( (${ANY_DATE}))|( на (${ANY_DATE})))?$`, 'gi');
export const WHAT_ACTIVATION = new RegExp(
  `(что|чо|шо|че|чё)( (за|по|у нас|(${ANY_DATE})|на ${ANY_DATE}))* (парам|пары)( на)?( (${ANY_DATE}))?$`,
  'gi',
);
export const AT_ACTIVATION = new RegExp(`пары( (на|в|во))?( (${ANY_DATE}))+`, 'gi');
export const WHOM_ACTIVATION = /(.*какие (завтра|послезавтра)? (пары).*|пары.*?какие)/gi;

export const LANG_ORDER = /первая|вторая|третья|четв[её]ртая|пятая|шестая|седьмая/i;
export const ORDER_LESSON_ACTIVATION =
  /^(какая|где|\d|первая|вторая|третья|четв[её]ртая|пятая|шестая|седьмая) (\d|первая|вторая|третья|четв[её]ртая|пятая|шестая|седьмая|пара|какая) (пара|какая|где)/gi;
export const ORDER_LAST_LESSON_ACTIVATION = /^(какая|где|ласт|последняя) (пара|последняя|ласт) (пара|какая|где)/gi;
export const ORDER_FIRST_LESSON_ACTIVATION =
  /^(к какой|завтра|сегодня)( нам)? (к какой|завтра|сегодня|паре) (паре|сегодня|завтра)/gi;

export const BAN_WORDS = /(задали)/i;

export const WHERE_AUDIENCE = /^(куда|где|какая) (идти|пара|аудитория)/gi;
export const NEXT_AUDIENCE = /^(какая |где |что )?(некст|следующая|след)( пара)?/gi;

export const banWordsExits = (text: string): boolean => {
  return !!text.match(BAN_WORDS);
};

export class ProcessedTextInstance {
  phrase: string;
  data?: i18nReplacements;
}

export type ProcessedText = ProcessedTextInstance | ProcessedTextInstance[];

export class TextProcessor {
  private static readonly log = new Logger('TextProcessor');

  public static buildText(texts: ProcessedText, locale: string): string {
    const result: string[] = [];

    if (!Array.isArray(texts)) texts = [texts];

    texts = lodash.compact(texts);

    for (const text of texts) {
      const data = text.data;
      let phrase = text.phrase;

      const matches = phrase.match(/([A-Z_\d]+)/g);

      if (matches)
        for (const match of matches) {
          const localized = localization(match, locale, data);
          phrase = phrase.replace(match, localized);
        }

      result.push(phrase);
    }

    return result.join('\n\n');
  }

  public static buildClassRoom(classRoom: string, distance: boolean, corpus?: string): string | undefined {
    if (distance) return undefined;

    if (classRoom && corpus) return `${corpus}-${classRoom}`;
    if (classRoom) return classRoom;
  }

  public static lessons(group: StudyGroup, atDate: DateTime, structDate = false): ProcessedTextInstance[] {
    const lessonAtDay = group.getLessonsAtDay(atDate);
    if (lessonAtDay.length < 1) return [this.scheduleEmpty(atDate, structDate)];

    const groupProcessor = new LessonGroupProcessor(lessonAtDay);

    const mnemonic = this.atDate(atDate, structDate);
    const result: ProcessedTextInstance[] = [
      {
        phrase: `SCHEDULE_AT_DAY ${mnemonic.phrase}`,
        data: {
          groupName: group.name,
        },
      },
    ];

    const lessonOrders = groupProcessor.getOrders();
    for (const lessonOrder of lessonOrders) {
      const gropedLessons = groupProcessor.getLessonGroup(lessonOrder);
      if (!gropedLessons) continue;

      let processedTexts: ProcessedTextInstance[];
      let anyLessonInOrder: Lesson;

      switch (gropedLessons.type) {
        case 'SINGLE':
          processedTexts = this.singleLesson(gropedLessons);
          anyLessonInOrder = gropedLessons.lesson;
          break;
        case 'SINGLE_DIFFERENT_CLASS_ROOMS':
          processedTexts = this.singleManyClassRoomsLesson(gropedLessons);
          anyLessonInOrder = gropedLessons.firstLesson;
          break;
        case 'MULTIPLY':
          processedTexts = this.multiplyLessons(gropedLessons);
          anyLessonInOrder = gropedLessons.lessons[0];
          break;
      }

      processedTexts = lodash.compact(processedTexts);
      processedTexts.unshift(this.lessonHeader(anyLessonInOrder, false));

      const processedLessonPhrases: string[] = processedTexts.map((processedText) => processedText.phrase);
      const processedLessonData: any[] = processedTexts.map((processedText) => processedText.data);

      result.push({
        phrase: processedLessonPhrases.join('\n'),
        data: lodash.assign({}, ...processedLessonData),
      });
    }

    return result;
  }

  public static buildSimpleText(phrase: string, data?: i18nReplacements): ProcessedTextInstance {
    return {
      phrase: phrase,
      data: data,
    };
  }

  public static short(group: StudyGroup, now: boolean): ProcessedText {
    const currentTime = Time.get();
    this.log.debug(`Request time: ${currentTime}`);

    const lessonAtDay = group.getLessonsAtDay(currentTime);
    this.log.debug(`Lessons at day: ${lessonAtDay.length}`);

    const groupProcessor = new LessonGroupProcessor(lessonAtDay);

    let order = now ? TimeRelativeProcessor.now(false, currentTime) : TimeRelativeProcessor.next(currentTime);
    this.log.debug(`Requested order: ${order}, with now flag: ${now}, at ${Time.get()}`);

    const firstInOrder = groupProcessor.getOrders()[0];
    const isClosest = order < firstInOrder;
    if (isClosest) order = firstInOrder;

    const target: LessonGroupResult | undefined = groupProcessor.getLessonGroup(order);

    this.log.debug(`FirstInOrder: ${firstInOrder} | IsClosest: ${isClosest}`);

    if (!target)
      return now
        ? this.notNowLessons(lessonAtDay.length, currentTime)
        : this.notNextLessons(lessonAtDay.length, currentTime);

    let outLesson: Lesson;
    let result: ProcessedTextInstance[];

    switch (target.type) {
      case 'SINGLE':
        result = this.singleLesson(target);
        outLesson = target.lesson;
        break;
      case 'SINGLE_DIFFERENT_CLASS_ROOMS':
        result = this.singleManyClassRoomsLesson(target);
        outLesson = target.firstLesson;
        break;
      case 'MULTIPLY':
        result = this.multiplyLessons(target);
        outLesson = target.lessons[0];
        break;
    }

    result.unshift(this.lessonHeader(outLesson, true));
    if (isClosest) result.unshift(this.buildSimpleText('CLOSEST_LESSON'));

    const resultPhrases = result.map((processedText) => processedText.phrase);
    const resultData = result.map((processedText) => processedText.data);

    return {
      phrase: resultPhrases.join('\n'),
      data: lodash.assign({}, ...resultData),
    };
  }

  public static order(group: StudyGroup, order: number, atDate = Time.get()): ProcessedText {
    const lessonAtDay = group.getLessonsAtDay(atDate);
    const groupProcessor = new LessonGroupProcessor(lessonAtDay);

    if (order < 0) order = groupProcessor.getOrders()[groupProcessor.getOrders().length - 1];
    if (order == 0) order = groupProcessor.getOrders()[0];

    const target: LessonGroupResult | undefined = groupProcessor.getLessonGroup(order);

    if (!target) return this.notOrderLesson(lessonAtDay.length, order, atDate);

    let outLesson: Lesson;
    let result: ProcessedTextInstance[];

    switch (target.type) {
      case 'SINGLE':
        result = this.singleLesson(target);
        outLesson = target.lesson;
        break;
      case 'SINGLE_DIFFERENT_CLASS_ROOMS':
        result = this.singleManyClassRoomsLesson(target);
        outLesson = target.firstLesson;
        break;
      case 'MULTIPLY':
        result = this.multiplyLessons(target);
        outLesson = target.lessons[0];
        break;
    }

    result.unshift(this.lessonHeader(outLesson, true));

    const resultPhrases = result.map((processedText) => processedText.phrase);
    const resultData = result.map((processedText) => processedText.data);

    return {
      phrase: resultPhrases.join('\n'),
      data: lodash.assign({}, ...resultData),
    };
  }

  public static atDateButton(date: DateTime, offset: number): ProcessedTextInstance {
    if (offset == 0) return this.buildSimpleText('SCHEDULE_AT_DATE_BUTTON_NOW');

    const atDate = moment(date).add(offset, 'd');
    const shortWeekday = `WEEKDAY_${atDate.isoWeekday()}_SHORT`;

    if (Math.abs(offset) < 7)
      return this.buildSimpleText(
        offset > 0
          ? `${shortWeekday} SCHEDULE_AT_DATE_BUTTON_NEXT_DAY`
          : `SCHEDULE_AT_DATE_BUTTON_PREVIOUS_DAY ${shortWeekday}`,
      );
    else {
      const dateText = `${atDate.format('DD.MM')} ${shortWeekday}`;
      return this.buildSimpleText(
        offset > 0
          ? `${dateText} SCHEDULE_AT_DATE_BUTTON_NEXT_WEEK`
          : `SCHEDULE_AT_DATE_BUTTON_PREVIOUS_WEEK ${dateText}`,
      );
    }
  }

  public static groupCourseBump(groups: BumpedGroupsResult[]): ProcessedTextInstance {
    const stringBuilder: ProcessedTextInstance[] = [];

    if (groups.length < 2) {
      stringBuilder.push(this.buildSimpleText('GROUP_COURSE_BUMP_ONE_HEADER', { groupName: groups[0].group.name }));
    } else {
      stringBuilder.push(this.buildSimpleText('GROUP_COURSE_BUMP_MANY_HEADER'));
      groups.forEach((group) => {
        stringBuilder.push({
          phrase: `${group.oldGroup.name} -> ${group.group.name}`,
        });
      });
    }
    stringBuilder.push(this.buildSimpleText('\nGROUP_COURSE_SET_GROUP_HELP'));

    const resultPhrases = stringBuilder.map((processedText) => processedText.phrase);
    const resultData = stringBuilder.map((processedText) => processedText.data);

    return {
      phrase: resultPhrases.join('\n'),
      data: lodash.assign({}, ...resultData),
    };
  }

  private static scheduleEmpty(atDate: DateTime, structDate = false): ProcessedTextInstance {
    return {
      phrase: `SCHEDULE_AT_DAY_IS ${this.atDate(atDate, structDate).phrase} SCHEDULE_AT_DAY_IS_NOT`,
    };
  }

  private static notNowLessons(todayCount: number, atDate: DateTime): ProcessedTextInstance {
    if (todayCount < 1) return this.scheduleEmpty(atDate);
    else
      return {
        phrase: 'LESSONS_IS_ENDED',
      };
  }

  private static notOrderLesson(todayCount: number, order: number, atDate: DateTime): ProcessedTextInstance {
    if (todayCount < 1) return this.scheduleEmpty(atDate);
    else
      return {
        phrase: 'ORDER_LESSON_NOT',
        data: {
          orderLesson: order,
        },
      };
  }

  private static notNextLessons(todayCount: number, atDate: DateTime): ProcessedTextInstance {
    if (todayCount < 1) return this.scheduleEmpty(atDate);
    else
      return {
        phrase: 'IS_LAST_LESSON_IN_DAY',
      };
  }

  private static lessonHeader(lesson: Lesson, short: boolean): ProcessedTextInstance {
    const result = ['LESSON_HEADER'];
    if (!short && lesson.isNow(true)) result.push('LESSON_NOW_POSTFIX');
    result.push('LESSON_TIME_POSTFIX');

    return {
      phrase: result.join(' '),
      data: {
        lessonOrder: `${lesson.order}`,
        lessonStart: this.timeFormat(lesson.start),
        lessonEnd: this.timeFormat(lesson.end),
      },
    };
  }

  private static singleLesson(lessonGroup: LessonGroupSingle): ProcessedTextInstance[] {
    const { lesson } = lessonGroup;

    const lessonClass = this.singleLessonClassRoomRender(lesson);
    const destination = this.destinationRender(lesson.distance, lessonClass);

    const result: ProcessedTextInstance[] = [
      {
        phrase: `LESSON_TYPE_${lesson.type}: ${lesson.name}`,
      },
      destination,
    ];

    return result;
  }

  private static singleLessonClassRoomRender(lesson: Lesson): ProcessedTextInstance | undefined {
    const { classRoom, distance, corpus } = lesson;
    const audience = this.buildClassRoom(classRoom, distance, corpus);
    if (audience) {
      let phraseResult: string;

      if (classRoom && corpus) phraseResult = `LESSON_AUDIENCE_ONE: ${audience}`;
      else if (classRoom) phraseResult = `LESSONS_NOT_FORMAT_AUDIENCE ${audience}`;
      return {
        phrase: phraseResult,
      };
    }
  }

  private static singleManyClassRoomsLesson(lessonGroup: LessonGroupSingleManyClassRooms): ProcessedTextInstance[] {
    const { classRooms, firstLesson } = lessonGroup;

    const lessonClass = this.singleManyClassRoomsLessonsClassRoomRender(classRooms);
    const destination = this.destinationRender(firstLesson.distance, lessonClass);

    const result: ProcessedTextInstance[] = [
      {
        phrase: `LESSON_TYPE_${firstLesson.type}: ${firstLesson.name}`,
      },
      destination,
    ];

    return result;
  }

  private static singleManyClassRoomsLessonsClassRoomRender(
    classRooms: LessonGroupClassRoom[],
  ): ProcessedTextInstance | undefined {
    if (classRooms.length > 5) return;

    const isSubgroupExist = lodash.every(classRooms, (classRoom) => !!classRoom.subgroup);
    const isNotFormatClassRoom = lodash.some(classRooms, (classRoom) => !classRoom.corpus);

    const classRoomStrings = classRooms.map((classRoom) => {
      const classRoomString = this.buildClassRoom(classRoom.classRoom, false, classRoom.corpus);
      const subgroupPrefix = isSubgroupExist ? `${classRoom.subgroup} LESSON_SUBGROUP: ` : '';
      return `${subgroupPrefix}${classRoomString}`;
    });

    let phrase = '';
    if (isNotFormatClassRoom) phrase = 'LESSON_NOT_FORMAT_AUDIENCE';
    else if (classRoomStrings.length > 1) phrase = 'LESSON_AUDIENCE_MANY';
    else if (classRoomStrings.length == 1) phrase = 'LESSON_AUDIENCE_ONE';
    else return;

    const result = [phrase];
    result.push(classRoomStrings.join(', '));

    return {
      phrase: result.join(': '),
    };
  }

  private static multiplyLessons(lessonGroup: LessonGroupMultiply): ProcessedTextInstance[] {
    const { lessons } = lessonGroup;
    const firstLesson = lessons[0];

    const destination = this.destinationRender(firstLesson.distance);
    const subjects = lessons.map((lesson) => lesson.name);

    return [
      {
        phrase: 'MULTIPLY_LESSONS_PREFIX',
      },
      {
        phrase: `LESSON_TYPE_${firstLesson.type}: ${subjects.join(', ')}`,
      },
      destination,
    ];
  }

  private static destinationRender(
    distance: boolean,
    lessonClass?: ProcessedTextInstance,
  ): ProcessedTextInstance | undefined {
    if (distance)
      return {
        phrase: 'LESSON_DISTANCE_POSTFIX',
      };
    else if (lessonClass) return lessonClass;
  }

  private static timeFormat(date: Date): string {
    return moment(date).format('HH:mm');
  }

  private static atDate(date: DateTime, structDate = false): ProcessedTextInstance {
    const currentDate = Time.get();
    const atDate = moment(date);
    const diff = Math.floor(atDate.startOf('d').diff(currentDate.startOf('d'), 'd', true));
    if (diff > 1 && diff <= 7 && !structDate)
      return {
        phrase: `WEEKDAY_${atDate.isoWeekday()}`,
      };
    else {
      const relativeDay = diff >= -2 && diff <= 1 ? `RELATIVE${diff < 0 ? '_BACK' : ''}_${Math.abs(diff)}` : undefined;
      if (relativeDay && (!structDate || (structDate && diff == 0)))
        return {
          phrase: relativeDay,
        };
      else
        return {
          phrase: `${atDate.date()} MONTH_${atDate.month()}${
            atDate.year() - currentDate.year() !== 0 ? ` ${atDate.year()}` : ''
          }, WEEKDAY_${atDate.isoWeekday()}`,
        };
    }
  }
}
