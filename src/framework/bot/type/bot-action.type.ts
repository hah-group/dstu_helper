import { KeyboardBuilder } from '../keyboard/keyboard.builder';
import { SendOptions } from './bot-message.type';
import { BotExtendedContext } from './bot-context.type';
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

export type BotBroadcastAction = {
  type: 'broadcast';
  targetIds: number[];
  message: Text;
};
