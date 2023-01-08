import * as moment from 'moment';
import { DateTime, Time } from '@dstu_helper/common';
import { TimeOrderInterval } from './time-order-interval.type';

export class TimeOrderProcessor {
  public static now(timeOrders: TimeOrderInterval[], strict: boolean, date: DateTime = Time.get()): number | undefined {
    for (let i = 0; i < timeOrders.length; i++) {
      const lesson = timeOrders[i];
      const isStructNow = date.isBetween(this.parseTime(lesson.start), this.parseTime(lesson.end), undefined, '[)');

      if (strict && isStructNow) return lesson.order;
      else if (strict) continue;

      const startDayDate = moment(date);
      if (i == 0 && date.isBetween(startDayDate.startOf('day'), this.parseTime(lesson.end), undefined, '[)'))
        return lesson.order;

      if (i > 0 && date.isBetween(this.parseTime(timeOrders[i - 1].end), this.parseTime(lesson.end), undefined, '[)'))
        return lesson.order;
    }
  }

  public static next(
    timeOrders: TimeOrderInterval[],
    date: DateTime = Time.get(),
    closestOrder?: number,
  ): number | undefined {
    const nowStruct = this.now(timeOrders, true, moment(date));
    const now = this.now(timeOrders, false, moment(date));

    const startDayDate = moment(date);
    if (date.isBetween(startDayDate, this.parseTime(timeOrders[(closestOrder || 1) - 1].start), undefined, '[)'))
      return timeOrders[closestOrder || 1].order;

    if (nowStruct) return timeOrders[nowStruct]?.order;
    else if (now) return timeOrders[now - 1].order;
  }

  private static parseTime(date: string): DateTime {
    const [hours, minutes, seconds] = date.split(':');
    return Time.get().hours(parseInt(hours)).minutes(parseInt(minutes)).seconds(parseInt(seconds));
  }
}
