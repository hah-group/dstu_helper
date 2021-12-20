import { KeyboardButton } from './keyboard-button';

export class TextButton extends KeyboardButton {
  constructor(label: string, id?: string, payload?: any) {
    super(label, id, payload);
  }

  public toVkObject(inlineMode: boolean): any {
    return {
      action: {
        type: inlineMode ? 'callback' : 'text',
        label: this.label,
        payload: {
          id: this._id,
          ...this._payload,
        },
      },
      color: this._color,
    };
  }

  public toTelegramObject(): any {
    return {
      text: this.label,
      callback_data: this._id,
    };
  }
}
