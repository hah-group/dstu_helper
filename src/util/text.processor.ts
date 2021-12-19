import { Lesson } from '../lesson/lesson.entity';
import * as moment from 'moment';
import { WeekdayDefinition } from './definition/weekday.definition';
import { TimeRelativeProcessor } from './time-relative.processor';
import { LessonType } from '@prisma/client';
import { DateTime, Time } from './time';
import { RelativeDayDefinition } from './definition/relative-day.definition';
import { MonthGenitiveDefinition } from './definition/month.definition';
import { StudyGroup } from '../study-group/study-group.entity';
import * as str from 'string';

export const SCHEDULE_ACTIVATION = /^расписание( пар)?/gi;
export const WHAT_ACTIVATION = /(что|чо|шо|че|чё)( (за|по|у нас|завтра))* (парам|пары)( на)?( завтра)?.*$/gi;
export const AT_ACTIVATION = /пары (на|в|во) [а-яё\d]+/gi;
export const WHOM_ACTIVATION = /(.*какие (завтра|послезавтра)? (пары).*|пары.*?какие)/gi;

export const BAN_WORDS = /(задали)/i;

export const WHERE_AUDIENCE = /(куда|где|какая)( [а-я ]*)?(идти|пара|аудитория)/gi;
export const NEXT_AUDIENCE = /^(какая |где |что )?(некст|следующая|след)( пара)?$/gi;

export const banWordsExits = (text: string): boolean => {
  return !!text.match(BAN_WORDS);
};

export class TextProcessor {
  static LAST_LESSON = 'Это последнняя пара';
  static LESSONS_ENDED = 'Пары закончились';
  static TODAY_LESSON_NONE = 'Сегодня пар нет';
  static NOW_LESSON_NONE = 'Сейчас пар нет';
  static SCHEDULE_UPDATING = 'Расписание обновляется, нужно немного времени';
  static WRITE_GROUP_NAME = 'Напиши имя группы';
  static SOURCE_NOT_FOUND_GROUP = 'Такая группа не найдена';
  static NOT_FOUND_GROUP = 'Я не нашел твоей группы. Напиши !добавить в группу <имя группы> чтобы получать расписание';

  public static youAddInGroup(groupName: string): string {
    return `Ты добавлен в группу ${groupName}`;
  }

  public static scheduleEmpty(atDate: DateTime): string {
    return `😯 Пар на ${this.atDate(atDate)} нет!`;
  }

  public static notNowLessons(todayCount: number, atDate: DateTime): string {
    if (todayCount < 1) return this.scheduleEmpty(atDate);
    else return `Пары на ${this.atDate(atDate)} закончились!`;
  }

  public static notNextLessons(todayCount: number, atDate: DateTime): string {
    if (todayCount < 1) return this.scheduleEmpty(atDate);
    else return `Это последняя пара!`;
  }

  public static lessons(group: StudyGroup, atDate: DateTime): string {
    const groupedLessons = this.groupLessons(group.getLessonsAtDay(atDate));

    if (groupedLessons.size < 1) return this.scheduleEmpty(atDate);

    const mnemonic = this.atDate(atDate);
    let result = `Пары ${group.name} на ${mnemonic}\n\n`;

    for (const entry of groupedLessons.values()) {
      const lessonClass = this.lessonClass(entry);
      const firstLesson = entry[0];
      const manyPairAdd = `${entry.length > 1 && !firstLesson.subgroup ? '❗️ Несколько пар в одно время\n' : ''}`;
      result += `${manyPairAdd}📌 ${firstLesson.order} пара ${
        firstLesson.isNow(true) ? '(Сейчас)' : ''
      } (${this.timeFormat(firstLesson.start)} - ${this.timeFormat(firstLesson.end)})
📕 ${this.lessonType(firstLesson.type)}: ${firstLesson.name}
${lessonClass}\n\n`;
    }

    return result;
  }

  public static short(group: StudyGroup, now: boolean): string {
    const groupedLessons = this.groupLessons(group.getLessonsAtDay(Time.get()));

    const order = now ? TimeRelativeProcessor.now(false, Time.get()) : TimeRelativeProcessor.next(Time.get());
    const target: Lesson[] | undefined = groupedLessons.get(order);

    if (!target)
      return now
        ? this.notNowLessons(groupedLessons.size, Time.get())
        : this.notNextLessons(groupedLessons.size, Time.get());

    let result = '';

    const lessonClass = this.lessonClass(target, true);
    const firstLesson = target[0];
    const manyPairAdd = `${target.length > 1 && !firstLesson.subgroup ? '❗️ Несколько пар в одно время\n' : ''}`;
    result += `${manyPairAdd}📌 ${firstLesson.order} пара (${this.timeFormat(firstLesson.start)} - ${this.timeFormat(
      firstLesson.end,
    )})
📕 ${this.lessonType(firstLesson.type)}: ${firstLesson.name}
${lessonClass}\n\n`;

    return result;
  }

  private static groupLessons(lessons: Lesson[]): Map<number, Lesson[]> {
    const groupedLessons: Map<number, Lesson[]> = new Map<number, Lesson[]>();
    lessons.forEach((lesson) => {
      const order = lesson.order;
      let group = groupedLessons.get(order);

      if (!group) group = [lesson];
      else group.push(lesson);

      groupedLessons.set(order, group);
    });

    return groupedLessons;
  }

  private static lessonClass(lessons: Lesson[], full = false): string {
    ///TODO REFUCKTOR
    let result = `🏢 ${lessons[0].classRoom && lessons[0].corpus ? 'Аудитория:' : ''} `;
    let i = 0;
    for (const lesson of lessons) {
      const { classRoom, corpus, subgroup } = lesson;
      if (lessons.length > 1 && !subgroup && !full) return '';
      const subgroupAdd = subgroup ? `${subgroup} п/г: ` : '';
      const moreAdd = lessons.length > 1 ? ', ' : '';
      if (classRoom && corpus) result += `${subgroupAdd}${corpus}-${classRoom}${i + 1 < lessons.length ? moreAdd : ''}`;
      else if (classRoom) result += `${subgroupAdd}${classRoom}${moreAdd}`;
      i++;
    }

    if ((lessons.length < 2 && lessons[0].distance) || (full && lessons[0].distance))
      result += '\n❗️ Пара дистанционная';
    if (!lessons[0].classRoom) return '';

    return result;
  }

  private static timeFormat(date: Date): string {
    return moment(date).format('HH:mm');
  }

  private static atDate(date: DateTime): string {
    const currentDate = Time.get();
    const atDate = moment(date);
    const diff = Math.floor(atDate.startOf('d').diff(currentDate.startOf('d'), 'd', true));
    if (diff > 1 && diff <= 7) return WeekdayDefinition[atDate.isoWeekday()];
    else {
      const relativeDay = RelativeDayDefinition[diff];
      if (relativeDay) return relativeDay;
      else
        return `${atDate.date()} ${MonthGenitiveDefinition[atDate.month()]}${
          atDate.year() - currentDate.year() !== 0 ? ` ${atDate.year()}` : ''
        }, ${str(WeekdayDefinition[atDate.isoWeekday()]).capitalize().s}`;
    }
  }

  private static lessonType(type: LessonType): string {
    switch (type) {
      case LessonType.LECTURE:
        return 'Лекция';
      case LessonType.PRACTICAL:
        return 'Практика';
      case LessonType.LABORATORY:
        return 'Лабораторная';
      case LessonType.EXAMINATION:
        return 'Экзамен';
      case LessonType.EXAM_WITHOUT_MARK:
        return 'Зачёт';
    }
  }
}
