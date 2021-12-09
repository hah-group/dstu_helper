/*
import { GroupWithScheduleFullType } from '../study-group/group-with-schedule-full.type';
import * as moment from 'moment';
import { WeekdayDefinition } from './weekday.definition';
import { TimeRelativeProcessor } from './time-relative.processor';
import { LessonType, Schedule } from '@prisma/client';

export const SCHEDULE_ACTIVATION = /расписание( пар)?.*!/gi;
export const WHAT_ACTIVATION = /(что|чо|шо|че|чё) (?!на завтра)(на |у нас завтра|по парам).*!/gi;
export const WHOM_ACTIVATION = /(.*какие .*?(пары).*|пары.*?какие)/gi;
export const AT_ACTIVATION = /пары (на|в|во).*!/gi;

export const WHERE_AUDIENCE = /(куда|где|какая).{1,20}(идти|пара|аудитория)/gi;

export const NEXT_AUDIENCE = /^(какая |где |что )?(некст|следующая|след)( пара)?$/gi;

export const ADD_TO_GROUP = /!добавить в группу (.*)$/gi;
export const HELP_ACTIVATION = /!помощь/gi;

export class TextProcessor {
  static LAST_LESSON = 'Это последнняя пара';
  static LESSONS_ENDED = 'Пары закончились';
  static TODAY_LESSON_NONE = 'Сегодня пар нет';
  static NOW_LESSON_NONE = 'Сейчас пар нет';
  static SCHEDULE_UPDATING = 'Расписание обновляется, нужно немного времени';
  static WRITE_GROUP_NAME = 'Напиши имя группы';
  static SOURCE_NOT_FOUND_GROUP = 'Такая группа не найдена';
  static NOT_FOUND_GROUP = 'Я не нашел твоей группы. Напиши !добавить в группу <имя группы> чтобы получать расписание';
  static HELP = `Я бот расписания ДГТУ
Чтобы узнать расписание можешь просто написать:
расписание
шо по парам
и любые другие вопросительные предложения

Также можешь узнать расписание на другие дни:
расписание на завтра
пары на четверг
че по парам на пт
и любые относительные метки времени

Также есть укороченная версия:
где пара
какая некст пара
и любые другие предложения

Для того, чтобы внести себя в группу напиши
!добавить в группу <имя группы>`;

  public static youAddInGroup(groupName: string): string {
    return `Ты добавлен в группу ${groupName}`;
  }

  public static Compile(schedule: GroupWithScheduleFullType, atDate: Date): string {
    const mnemonic = this.weekCompiler(atDate);
    const fullSchedule =
      moment().startOf('d').isSame(atDate) || Math.abs(moment().startOf('d').diff(moment(atDate).startOf('d'))) > 0;
    if (fullSchedule && schedule.Schedule.length < 1) return `Пар на ${mnemonic} нет!`;
    if (schedule.Schedule.length < 1)
      return `Пары на сегодня закончились. Если нужно полное расписание - пиши "фул", "полное", "всё"`;

    let result = `Пары ${schedule.name} на ${mnemonic}\n\n`;

    schedule.Schedule.forEach((lesson, index) => {
      const current = TimeRelativeProcessor.isNow(lesson, schedule.Schedule[index - 1]);
      result += `📌 ${lesson.lessonNumber} пара ${current ? '(Сейчас)' : ''} (${this.timeCompiler(
        lesson.start,
      )} - ${this.timeCompiler(lesson.end)})
📕 ${this.typeCompiler(lesson.lessonType)}: ${lesson.subjectName}
🏢 Аудитория: ${lesson.corpus}-${lesson.classRoom}
${lesson.distance ? '❗️ Пара дистанционная' : ''}\n`;
    });

    return result;
  }

  public static ShortInfo(lesson: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>): string {
    return `📕 ${this.typeCompiler(lesson.lessonType)}: ${lesson.subjectName}
⏱ ${this.timeCompiler(lesson.start)} - ${this.timeCompiler(lesson.end)}
🏢 Аудитория: ${lesson.corpus}-${lesson.classRoom}${lesson.distance ? '\n❗️ Пара дистанционная' : ''}`;
  }

  private static timeCompiler(date: Date): string {
    return moment(date).format('HH:mm');
  }

  private static weekCompiler(date: Date): string {
    const currentDate = moment();
    const atDate = moment(date);
    const diff = Math.abs(currentDate.startOf('d').diff(atDate, 'd', true));
    if (diff > 1) return WeekdayDefinition[atDate.isoWeekday()];
    else {
      if (diff === 0) return 'сегодня';
      else if (diff === 1) return 'завтра';
    }
  }

  private static typeCompiler(type: LessonType): string {
    switch (type) {
      case LessonType.LECTURE:
        return 'Лекция';
      case LessonType.PRACTICAL:
        return 'Практика';
      case LessonType.LABORATORY:
        return 'Лабораторная';
    }
  }
}
*/
