import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';

export class EqualsHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('equals', (a, b, opts) => {
      return a == b;
    });
  }
}
