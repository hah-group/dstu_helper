import { KeyboardButton } from './keyboard-button';
import { ProcessedTextInstance } from '../../../modules/util/text.processor';

export class LinkButton extends KeyboardButton {
  private readonly link: string;

  constructor(label: ProcessedTextInstance, link: string, id?: string, payload?: any) {
    super(label, id, payload);
    this.link = link;
  }

  public toVkObject(locale: string): any {
    return {
      action: {
        type: 'open_link',
        label: this.localize(this.label, locale),
        link: this.link,
        payload: {
          id: this._id,
          ...this._payload,
        },
      },
    };
  }

  public toTelegramObject(locale: string): any {
    return {
      text: this.localize(this.label, locale),
      url: this.link,
    };
  }
}
