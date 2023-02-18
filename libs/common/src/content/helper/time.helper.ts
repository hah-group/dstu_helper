import { DateTime } from '@dstu_helper/common';
import * as Handlebars from 'handlebars';
import * as moment from 'moment';

import { BaseHelper } from './util/base.helper';

export class TimeHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('time', (a: DateTime, opts) => {
      const format = opts.hash?.format || 'HH:mm';
      return moment(a).format(format);
    });
  }
}
