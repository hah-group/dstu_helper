import { DateTime, Time } from '@dstu_helper/common';
import * as Handlebars from 'handlebars';
import * as moment from 'moment';
import * as str from 'string';

import { MonthGenDefinition, MonthNumbers } from './definition/month.definition';
import { WeekdayGenDefinition, WeekdayNumbers } from './definition/weekday.definition';
import { BaseHelper } from './util/base.helper';

export class RelativeDateHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('relative-date', (date: Date, opts) => {
      console.log(opts);
      const structDate = opts.hash?.strict || false;

      const currentDate = Time.get();
      const atDate = moment(date);
      const diff = Math.floor(atDate.startOf('d').diff(currentDate.startOf('d'), 'd', true));
      if (diff > 1 && diff <= 7 && !structDate) return WeekdayGenDefinition[<WeekdayNumbers>atDate.isoWeekday()];
      else {
        const relativeDay = this.getRelative(diff);
        if (relativeDay && (!structDate || (structDate && diff == 0))) return relativeDay;
        else return this.getAbsolute(atDate, currentDate);
      }
    });
  }

  public getAbsolute(date: DateTime, currentDate: DateTime): string {
    const stringBuilder: string[] = [];
    stringBuilder.push(`${date.date()}`);
    stringBuilder.push(` ${MonthGenDefinition[<MonthNumbers>date.month()]}`);
    if (date.year() - currentDate.year() !== 0) stringBuilder.push(` ${date.year()}`);
    stringBuilder.push(`, ${str(WeekdayGenDefinition[<WeekdayNumbers>date.isoWeekday()]).capitalize()}`);

    return stringBuilder.join('');
  }

  private getRelative(diff: number): string | undefined {
    if (diff >= -2 && diff <= 1) {
      switch (diff) {
        case 0:
          return 'сегодня';
        case 1:
          return 'завтра';
        case -1:
          return 'вчера';
        case -2:
          return 'позавчера';
      }
    }
  }
}
