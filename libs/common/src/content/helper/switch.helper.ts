import * as Handlebars from 'handlebars';

import { BaseHelper } from './util/base.helper';

export class SwitchHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('switch', (value, trueReturn, falseReturn, opts) => {
      return value ? trueReturn : falseReturn;
    });
  }
}
