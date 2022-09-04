import { KeyboardBuilder } from '../keyboard/keyboard.builder';
import { SendOptions } from './bot-message.type';
import { BotContext } from './bot-context.type';

export type BotAction<T> = {
  context: BotContext;
  action: T;
};

export type BotMessageAction = {
  type: 'message';
  message: string;
  keyboard?: KeyboardBuilder;
  options?: SendOptions;
};

export type BotAlertAction = {
  type: 'alert';
  message: string;
};
