import { TextButton } from '../../../../framework/bot/keyboard/text.button';
import { Text } from '../../../../framework/text/text';
import { KeyboardBuilder } from '../../../../framework/bot/keyboard/keyboard.builder';

export const ChangeGroupConfirmButton = new TextButton(
  Text.Build('change-group-button'),
  'ConversationChangeGroupConfirm',
);
export const ChangeGroupConfirmKeyboard = new KeyboardBuilder().add(ChangeGroupConfirmButton).inline();
