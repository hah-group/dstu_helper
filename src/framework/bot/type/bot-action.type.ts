import { KeyboardBuilder } from '../keyboard/keyboard.builder';
import { SendOptions } from './bot-message.type';
import { BotContext } from './bot-context.type';
import { Text } from '../../text/text';

export type BotAction<T> = {
  context: BotContext;
  action: T;
};

export type BotMessageAction = {
  type: 'message';
  message: Text;
  keyboard?: KeyboardBuilder;
  options?: SendOptions;
};

export type BotAlertAction = {
  type: 'alert';
  message: Text;
};
