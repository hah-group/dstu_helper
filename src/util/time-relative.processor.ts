import { Schedule } from '@prisma/client';
import * as moment from 'moment';

export class TimeRelativeProcessor {
  public static isNow(
    lesson: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>,
    prevLesson?: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>,
  ): boolean {
    if (!moment().isSame(lesson.start, 'd')) return false;
    if (!prevLesson && moment().isSameOrBefore(lesson.start)) return true;
    if (moment().isBetween(lesson.start, lesson.end, undefined, '[]')) return true;
    if (!prevLesson) return false;
    return moment().isSameOrAfter(prevLesson.end) && moment().isSameOrBefore(lesson.start);
  }

  public static isNext(
    lesson: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>,
    prevLesson?: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>,
  ): boolean {
    if (!moment().isSame(lesson.start, 'd')) return false;
    if (!prevLesson && moment().isBefore(lesson.start)) return true;
    if (!prevLesson) return false;
    if (moment().isAfter(prevLesson.end) && moment().isBefore(lesson.start)) return true;
    return moment().isBetween(prevLesson.start, prevLesson.end, undefined, '[]');
  }

  public static isEnded(lesson: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>): boolean {
    return moment().isAfter(lesson.end);
  }
}
