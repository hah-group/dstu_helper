import { KeyboardButton, KeyboardPayload } from './keyboard-button';
import { Text } from '../../text/text';

export class LinkButton extends KeyboardButton {
  private readonly link: string;

  constructor(label: Text, link: string, id?: string) {
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
