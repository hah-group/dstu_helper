import { KeyboardBuilder, TextButton } from '@dstu_helper/common';
import { Content } from '@dstu_helper/common';

export const ChangeGroupConfirmButton = new TextButton(
  Content.Build('change-group-button'),
  'ConversationChangeGroupConfirm',
);
export const ChangeGroupConfirmKeyboard = new KeyboardBuilder().add(ChangeGroupConfirmButton).inline();
