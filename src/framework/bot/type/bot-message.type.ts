import {
  BotBaseContext,
  BotChatEventPayload,
  BotContext,
  BotContextPayload,
  BotInlineKeyPayload,
  BotMessagePayload,
} from './bot-context.type';
import { KeyboardBuilder } from '../keyboard/keyboard.builder';
import { Text } from '../../text/text';

export interface SendOptions {
  attachments?: any[];
  forcePrivate?: boolean;
  reply?: boolean;
}

export type BotSendCallback = {
  send: (message: Text, keyboard?: KeyboardBuilder, options?: SendOptions) => Promise<number>;
};

export type BotEditCallback = {
  edit: (message?: Text, keyboard?: KeyboardBuilder) => Promise<void>;
};

export type BotAlertCallback = {
  alert: (message: Text) => Promise<void>;
};

export type BotFlushCallback = {
  flush: () => Promise<void>;
};

type BotPayload<T extends BotContextPayload> = { payload: T };

export type BotAnyMessage = BotBaseContext & BotSendCallback;

export type BotHandlerContext = BotContext & BotSendCallback & BotEditCallback & BotAlertCallback & BotFlushCallback;

export type BotMessage = BotBaseContext & BotPayload<BotMessagePayload> & BotSendCallback & BotEditCallback;

export type BotChatEvent = BotBaseContext & BotPayload<BotChatEventPayload> & BotSendCallback;

export type BotInlineMessage = BotBaseContext &
  BotPayload<BotInlineKeyPayload> &
  BotSendCallback &
  BotEditCallback &
  BotAlertCallback &
  BotFlushCallback;
