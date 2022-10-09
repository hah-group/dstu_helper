import * as moment from 'moment';

export type DateTime = moment.Moment;

export class Time {
  public static get(): DateTime {
    return moment('2022-09-01 14:35');
  }
}
