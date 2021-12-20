import { KeyboardButton } from './keyboard-button';

export class LinkButton extends KeyboardButton {
  private readonly link: string;

  constructor(label: string, link: string, id?: string, payload?: any) {
    super(label, id, payload);
    this.link = link;
  }

  public toVkObject(): any {
    return {
      action: {
        type: 'open_link',
        label: this.label,
        link: this.link,
        payload: {
          id: this._id,
          ...this._payload,
        },
      },
    };
  }

  public toTelegramObject(): any {
    return {
      text: this.label,
      url: this.link,
    };
  }
}
