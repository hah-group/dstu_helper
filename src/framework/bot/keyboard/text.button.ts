import { KeyboardButton } from './keyboard-button';
import { Text } from '../../text/text';

export class TextButton extends KeyboardButton {
  constructor(label: Text, id?: string, payload?: any) {
    super(label, id, payload);
  }
}
