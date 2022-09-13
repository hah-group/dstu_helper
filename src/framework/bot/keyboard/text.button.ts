import { KeyboardButton } from './keyboard-button';
import { ProcessedTextInstance } from '../../../old_modules/util/text.processor';

export class TextButton extends KeyboardButton {
  constructor(label: ProcessedTextInstance, id?: string, payload?: any) {
    super(label, id, payload);
  }

  public toVkObject(locale: string, inlineMode: boolean): any {
    return {
      action: {
        type: inlineMode ? 'callback' : 'text',
        label: this.localize(this.label, locale),
        payload: {
          id: this._id || this.label,
          ...this._payload,
        },
      },
      color: this._color,
    };
  }

  public toTelegramObject(locale: string): any {
    return {
      text: this.localize(this.label, locale),
      callback_data: this._id || this.localize(this.label, locale),
    };
  }
}
