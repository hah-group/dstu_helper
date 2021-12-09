import * as moment from 'moment';

export type DateTime = moment.Moment;

export class Time {
  public static get(): DateTime {
    return moment().add(2, 'w');
  }
}
