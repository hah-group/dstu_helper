import { Content } from '../../content';
import { KeyboardBuilder } from '../keyboard';
import { BotExtendedContext } from './bot-context.type';
import { SendOptions } from './bot-message.type';

export type BotAction<T, E = any> = {
  context: BotExtendedContext<E>;
  action: T;
};

export type BotMessageAction = {
  type: 'message';
  message: Content;
  keyboard?: KeyboardBuilder;
  options?: SendOptions;
};

export type BotEditAction = {
  type: 'edit';
  message?: Content;
  keyboard?: KeyboardBuilder;
};

export type BotAlertAction = {
  type: 'alert';
  message: Content;
};

export type BotBroadcastAction = {
  type: 'broadcast';
  targetIds: number[];
  message: Content;
};
