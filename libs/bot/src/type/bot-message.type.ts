import { Content } from '@dstu_helper/common';

import { KeyboardBuilder } from '../keyboard';
import {
  BotBaseContext,
  BotChatEventPayload,
  BotContext,
  BotContextPayload,
  BotInlineKeyPayload,
  BotMessagePayload,
} from './bot-context.type';

export interface SendOptions {
  attachments?: any[];
  forcePrivate?: boolean;
  reply?: boolean;
}

export type BotSendCallback = {
  send: (message: Content, keyboard?: KeyboardBuilder, options?: SendOptions) => Promise<number>;
};

export type BotEditCallback = {
  edit: (message?: Content, keyboard?: KeyboardBuilder) => Promise<void>;
};

export type BotAlertCallback = {
  alert: (message: Content) => Promise<void>;
};

export type BotFlushCallback = {
  flush: () => Promise<void>;
};

type BotPayload<T extends BotContextPayload> = { payload: T };

export type BotAnyMessage = BotBaseContext & BotSendCallback;

export type BotHandlerContext = BotContext & BotSendCallback & BotEditCallback & BotAlertCallback & BotFlushCallback;

export type BotMessage = BotBaseContext & BotPayload<BotMessagePayload> & BotSendCallback & BotEditCallback;

export type BotEditableMessage = BotBaseContext & BotSendCallback & BotEditCallback;

export type BotChatEvent = BotBaseContext & BotPayload<BotChatEventPayload> & BotSendCallback;

export type BotInlineMessage = BotBaseContext &
  BotPayload<BotInlineKeyPayload> &
  BotSendCallback &
  BotEditCallback &
  BotAlertCallback &
  BotFlushCallback;