import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';
import * as moment from 'moment';
import { DateTime } from '@dstu_helper/common';

export class TimeHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('time', (a: DateTime, opts) => {
      return moment(a).format('HH:mm');
    });
  }
}
