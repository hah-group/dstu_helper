import {
  BotBaseContext,
  BotChatEventPayload,
  BotContext,
  BotContextPayload,
  BotInlineKeyPayload,
  BotMessagePayload,
} from './bot-context.type';
import { KeyboardBuilder } from '../keyboard/keyboard.builder';

export interface SendOptions {
  attachments?: any[];
  ignorePlaceholder?: boolean;
  forcePrivate?: boolean;
  reply?: boolean;
}

export type BotSendCallback = {
  send: (message: string, keyboard?: KeyboardBuilder, options?: SendOptions) => Promise<void>;
};

export type BotEditCallback = {
  edit: (
    message: string,
    keyboard?: KeyboardBuilder,
    options?: Omit<SendOptions, 'forcePrivate' | 'ignorePlaceholder'>,
  ) => Promise<void>;
};

export type BotAlertCallback = {
  alert: (message: string) => void;
};

type BotPayload<T extends BotContextPayload> = { payload: T };

export type BotHandlerContext = BotContext & BotSendCallback & BotEditCallback & BotAlertCallback;

export type BotMessage = BotBaseContext & BotPayload<BotMessagePayload> & BotSendCallback & BotEditCallback;

export type BotChatEvent = BotBaseContext & BotPayload<BotChatEventPayload> & BotSendCallback & BotEditCallback;

export type BotInlineKeyEvent = BotBaseContext &
  BotPayload<BotInlineKeyPayload> &
  BotSendCallback &
  BotEditCallback &
  BotAlertCallback;
