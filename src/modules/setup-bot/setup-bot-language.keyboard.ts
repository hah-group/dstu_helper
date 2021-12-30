import { KeyboardBuilder } from '../bot/keyboard/keyboard.builder';
import { TextButton } from '../bot/keyboard/text.button';
import { TextProcessor } from '../util/text.processor';

export const SetupBotLanguageRussianButton = TextProcessor.buildSimpleText('SETUP_RUSSIAN_BUTTON');
export const SetupBotLanguageEnglishButton = TextProcessor.buildSimpleText('SETUP_ENGLISH_BUTTON');

export const SetupBotLanguageKeyboard = new KeyboardBuilder()
  .add(new TextButton(SetupBotLanguageEnglishButton))
  .add(new TextButton(SetupBotLanguageRussianButton))
  .oneTime();
