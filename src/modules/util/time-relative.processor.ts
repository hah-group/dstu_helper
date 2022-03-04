import * as moment from 'moment';
import { DateTime, Time } from './time';
import { lessonOrderInterval } from './lesson-order-interval';

export class TimeRelativeProcessor {
  public static now(struct: boolean, date: DateTime = Time.get()): number | undefined {
    for (let i = 0; i < lessonOrderInterval.length; i++) {
      const lesson = lessonOrderInterval[i];
      const isStructNow = date.isBetween(this.parseTime(lesson.start), this.parseTime(lesson.end), undefined, '[)');

      if (struct && isStructNow) return lesson.order;
      else if (struct) continue;

      const startDayDate = moment(date);
      if (i == 0 && date.isBetween(startDayDate.startOf('day'), this.parseTime(lesson.end), undefined, '[)'))
        return lesson.order;

      if (
        i > 0 &&
        date.isBetween(this.parseTime(lessonOrderInterval[i - 1].end), this.parseTime(lesson.end), undefined, '[)')
      )
        return lesson.order;
    }
  }

  public static next(date: DateTime = Time.get()): number | undefined {
    const nowStruct = this.now(true, moment(date));
    const now = this.now(false, moment(date));

    const startDayDate = moment(date);
    if (date.isBetween(startDayDate, this.parseTime(lessonOrderInterval[0].start), undefined, '[)'))
      return lessonOrderInterval[1].order;

    if (nowStruct) return lessonOrderInterval[nowStruct]?.order;
    else if (now) return lessonOrderInterval[now - 1].order;
  }

  private static parseTime(date: string): DateTime {
    return moment(date, 'HH:mm:ss');
  }
}
