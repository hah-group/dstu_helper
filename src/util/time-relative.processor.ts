import { Schedule } from '@prisma/client';
import * as moment from 'moment';

export class TimeRelativeProcessor {
  public static isNow(
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
  }
}
