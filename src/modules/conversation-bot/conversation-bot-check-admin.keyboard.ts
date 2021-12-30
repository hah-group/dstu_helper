import { KeyboardBuilder } from '../bot/keyboard/keyboard.builder';
import { TextButton } from '../bot/keyboard/text.button';
import { TextProcessor } from '../util/text.processor';

export const ConversationBotCheckAdminButton = 'conv_admin_check';

export const ConversationBotCheckAdminKeyboard = new KeyboardBuilder()
  .add(
    new TextButton(TextProcessor.buildSimpleText('CONVERSATION_CHECK_ADMIN_BUTTON'), ConversationBotCheckAdminButton),
  )
  .inline();
