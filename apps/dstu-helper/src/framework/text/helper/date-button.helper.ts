import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';
import * as moment from 'moment';
import { WeekdayNumbers, WeekdayShortDefinition } from '../weekday.definition';
import * as str from 'string';
import * as lodash from 'lodash';
import { DateTime } from '@dstu_helper/common';

export class DateButtonHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('dateButton', (date: DateTime, opts) => {
      const offset = opts.hash?.offset || 0;

      const atDate = moment(date).add(offset, 'd');
      const dateString = atDate.format('DD.MM');
      const weekday = this.getWeekday(atDate);
      const emoji = this.getEmoji(offset);

      let stringBuilder: (string | undefined)[] = [`${weekday} ${dateString}`];
      stringBuilder.push(emoji);

      stringBuilder = lodash.compact(stringBuilder);

      if (offset < 0) stringBuilder = stringBuilder.reverse();

      return stringBuilder.join(' ');
    });
  }

  private getWeekday(date: DateTime): string {
    return str(WeekdayShortDefinition[<WeekdayNumbers>date.isoWeekday()]).capitalize().s;
  }

  private getEmoji(offset: number): string | undefined {
    switch (offset) {
      case -1:
        return '◀️';
      case 1:
        return '▶️';
      case -7:
        return '⏪';
      case 7:
        return '⏩';
    }
  }
}
