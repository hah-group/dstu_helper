import { KeyboardBuilder } from '../keyboard/keyboard.builder';
import { SendOptions } from './bot-message.type';
import { BotContext, BotExtendedContext } from './bot-context.type';
import { Text } from '../../text/text';

export type BotAction<T, E = any> = {
  context: BotExtendedContext<E>;
  action: T;
};

export type BotMessageAction = {
  type: 'message';
  message: Text;
  keyboard?: KeyboardBuilder;
  options?: SendOptions;
};

export type BotEditAction = {
  type: 'edit';
  message?: Text;
  keyboard?: KeyboardBuilder;
};

export type BotAlertAction = {
  type: 'alert';
  message: Text;
};
