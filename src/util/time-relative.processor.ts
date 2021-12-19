//import { Schedule } from '@prisma/client';
import * as moment from 'moment';
import { DateTime, Time } from './time';
import { lessonOrderInterval } from './lesson-order-interval';

export class TimeRelativeProcessor {
  public static now(struct: boolean, date: DateTime = Time.get()): number | undefined {
    for (let i = 0; i < lessonOrderInterval.length; i++) {
      const lesson = lessonOrderInterval[i];
      const isStructNow = date.isBetween(lesson.start, lesson.end, undefined, '[)');

      if (struct && isStructNow) return lesson.order;
      else if (struct) continue;

      const startDayDate = moment(date);
      if (i == 0 && date.isBetween(startDayDate.startOf('day'), lesson.end, undefined, '[)')) return lesson.order;

      if (i > 0 && date.isBetween(lessonOrderInterval[i - 1].end, lesson.end, undefined, '[)')) return lesson.order;
    }
  }

  public static next(date: DateTime = Time.get()): number | undefined {
    const nowStruct = this.now(true, moment(date));
    const now = this.now(false, moment(date));

    const startDayDate = moment(date);
    if (date.isBetween(startDayDate, lessonOrderInterval[0].start, undefined, '[)'))
      return lessonOrderInterval[1].order;

    if (nowStruct) return lessonOrderInterval[nowStruct]?.order;
    else if (now) return lessonOrderInterval[now - 1].order;
  }

  /*public static now(
    lesson: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>,
    prevLesson?: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>,
  ): boolean {
    const currentTime = this.getCurrentTime();
    if (!currentTime.isSame(lesson.start, 'd')) return false;
    if (!prevLesson && currentTime.isSameOrBefore(lesson.start)) return true;
    if (currentTime.isBetween(lesson.start, lesson.end, undefined, '[]')) return true;
    if (!prevLesson) return false;
    return currentTime.isSameOrAfter(prevLesson.end) && currentTime.isSameOrBefore(lesson.start);
  }

  public static isNext(
    lesson: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>,
    prevLesson?: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>,
  ): boolean {
    const currentTime = this.getCurrentTime();
    if (!currentTime.isSame(lesson.start, 'd')) return false;
    if (!prevLesson && currentTime.isBefore(lesson.start)) return true;
    if (!prevLesson) return false;
    if (currentTime.isAfter(prevLesson.end) && currentTime.isBefore(lesson.start)) return true;
    return currentTime.isBetween(prevLesson.start, prevLesson.end, undefined, '[]');
  }

  public static isEnded(lesson: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>): boolean {
    const currentTime = this.getCurrentTime();
    return currentTime.isAfter(lesson.end);
  }

  private static getCurrentTime(): moment.Moment {
    return moment().add(3, 'h');
  }*/
}
