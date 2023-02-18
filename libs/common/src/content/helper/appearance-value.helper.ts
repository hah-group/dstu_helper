import * as Handlebars from 'handlebars';

//TODO FIX IT!!
import { AppearanceParams } from '../../../../../apps/dstu-helper/src/modules/user/user-properties/appearance.property';
import { BaseHelper } from './util/base.helper';

export class AppearanceValueHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('appearance-value', (type: AppearanceParams, action) => {
      if (typeof action != 'boolean') action = false;

      switch (type) {
        case 'show':
          return action ? '👁️ Отображать' : '👁️ Отображается';
        case 'hidden':
          return action ? '❌ Скрыть' : '❌ Скрыто';
        case 'short':
          return action ? '✂️ Сокращать' : '✂️ Сокращается';
        case 'light':
          return '⬜️️ Светлая тема';
        case 'dark':
          return '⬛️ Темная тема';
        case 'only_high':
          return '🎩 Только высшие';
      }
    });
  }
}
