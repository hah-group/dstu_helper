import { KeyboardButton } from './keyboard-button';
import { Text } from '../../text/text';

export class LinkButton extends KeyboardButton {
  private readonly link: string;

  constructor(label: Text, link: string, id?: string, payload?: any) {
    super(label, id, payload);
    this.link = link;
  }
}
