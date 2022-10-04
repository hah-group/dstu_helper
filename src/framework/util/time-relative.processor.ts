import * as moment from 'moment';
import { DateTime, Time } from './time';
//TODO Abstraction
import { DSTULessonInterval } from '../../modules/schedule/dstu/dstu-lesson-interval';

export class TimeRelativeProcessor {
  public static now(strict: boolean, date: DateTime = Time.get()): number | undefined {
    for (let i = 0; i < DSTULessonInterval.length; i++) {
      const lesson = DSTULessonInterval[i];
      const isStructNow = date.isBetween(this.parseTime(lesson.start), this.parseTime(lesson.end), undefined, '[)');

      if (strict && isStructNow) return lesson.order;
      else if (strict) continue;

      const startDayDate = moment(date);
      if (i == 0 && date.isBetween(startDayDate.startOf('day'), this.parseTime(lesson.end), undefined, '[)'))
        return lesson.order;

      if (
        i > 0 &&
        date.isBetween(this.parseTime(DSTULessonInterval[i - 1].end), this.parseTime(lesson.end), undefined, '[)')
      )
        return lesson.order;
    }
  }

  public static next(date: DateTime = Time.get(), closestOrder?: number): number | undefined {
    const nowStruct = this.now(true, moment(date));
    const now = this.now(false, moment(date));

    const startDayDate = moment(date);
    if (
      date.isBetween(startDayDate, this.parseTime(DSTULessonInterval[(closestOrder || 1) - 1].start), undefined, '[)')
    )
      return DSTULessonInterval[closestOrder || 1].order;

    if (nowStruct) return DSTULessonInterval[nowStruct]?.order;
    else if (now) return DSTULessonInterval[now - 1].order;
  }

  private static parseTime(date: string): DateTime {
    return moment(date, 'HH:mm:ss');
  }
}
