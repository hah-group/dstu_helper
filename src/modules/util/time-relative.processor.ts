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
}
