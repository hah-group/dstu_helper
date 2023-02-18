import * as Handlebars from 'handlebars';

import { BaseHelper } from './util/base.helper';

export class BooleanEmojiHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('boolean-emoji', (params, opts) => {
      const invert = opts.hash?.invert || false;

      if (typeof invert == 'boolean' && invert) params = !params;
      return params ? '✅' : '❌';
    });
  }
}
