import { KeyboardButton, KeyboardPayload } from './keyboard-button';
import { Text } from '../../text/text';

export class TextButton extends KeyboardButton {
  constructor(label: Text, id?: string) {
    super(label, id);
  }

  public getPayload(): KeyboardPayload {
    return {
      text: this.label.render(),
      id: this._id,
    };
  }
}
