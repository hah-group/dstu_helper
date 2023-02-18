import { Moment, TimeInterval } from '@dstu_helper/common';
import * as Handlebars from 'handlebars';

import { BaseHelper } from './util/base.helper';

export class TimeIntervalHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('time-interval', (timeInterval: TimeInterval, opts) => {
      const usePrefix = opts.hash?.usePrefix || true;

      if (timeInterval.type == 'time') {
        const stringBuilder = usePrefix ? ['Каждый день, в'] : [];
        stringBuilder.push(timeInterval.value);
        return stringBuilder.join(' ');
      } else if (timeInterval.type == 'interval') {
        const duration = Moment.duration(timeInterval.value, 'seconds');
        const hours = duration.hours();
        const minutes = duration.minutes();

        const stringBuilder = usePrefix ? ['За'] : [];
        if (hours > 0) stringBuilder.push(this.renderHours(hours));
        if (minutes > 0) stringBuilder.push(this.renderMinutes(minutes));
        if (usePrefix) stringBuilder.push('до ближайшей первой пары');
        return stringBuilder.join(' ');
      }
    });
  }

  private renderHours(value: number): string {
    if (value == 1) return `${value} час`;
    else if (value > 1 && value < 5) return `${value} часа`;
    else return `${value} часов`;
  }

  private renderMinutes(value: number): string {
    if (value == 1) return `${value} минуту`;
    else if (value > 1 && value < 5) return `${value} минуты`;
    else return `${value} минут`;
  }
}
