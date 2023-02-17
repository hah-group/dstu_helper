import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';

export class BooleanTextHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('booleanText', (value, trueReturn, falseReturn, opts) => {
      return value ? trueReturn : falseReturn;
    });
  }
}
