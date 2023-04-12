import { Content } from '@dstu_helper/common';

import { KeyboardButton, KeyboardPayload } from './keyboard-button';

export class LinkButton extends KeyboardButton {
  private readonly link: string;

  constructor(label: Content, link: string, id?: string) {
    super('open_link', label, id);
    this.link = link;
  }

  public getPayload(): KeyboardPayload {
    return {
      text: this.label.render(),
      id: this._id,
      link: this.link,
    };
  }
}
