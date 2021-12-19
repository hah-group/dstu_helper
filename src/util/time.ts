import * as moment from 'moment';

export type DateTime = moment.Moment;

export class Time {
  public static get(): DateTime {
    return moment(/*'2021-12-18 14:40+03'*/);
  }
}
