import * as moment from 'moment';

export type DateTime = moment.Moment;

export const Moment = moment;

export class Time {
  public static get(): DateTime {
    return moment('2022-10-26 12:00');
  }
}
