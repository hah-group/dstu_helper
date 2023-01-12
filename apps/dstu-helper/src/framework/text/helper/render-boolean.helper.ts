import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';

export class RenderBooleanHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('boolean', (params, opts) => {
      return params ? '✅' : '❌';
    });
  }
}
