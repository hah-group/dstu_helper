import { Content } from '../../content';
import { KeyboardButton, KeyboardPayload } from './keyboard-button';

export class TextButton extends KeyboardButton {
  constructor(label: Content, id?: string) {
    super('text', label, id);
  }

  public getPayload(): KeyboardPayload {
    return {
      text: this.label.render(),
      id: this.id,
    };
  }
}
