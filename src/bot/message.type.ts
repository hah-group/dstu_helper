import { SocialSource } from './social.enum';
import { KeyboardBuilder } from './keyboard/keyboard.builder';
import { EventType } from './metadata-type.enum';

export type TextMessage = VkTextMessage | TelegramTextMessage;
export type InlineButtonMessage = TelegramInlineButtonMessage | VkInlineButtonMessage;
export type Message = TextMessage | InlineButtonMessage;

interface BaseMessage {
  text: string;
  userId: number;
  from: SocialSource;
  type: EventType;
}

interface BaseTextMessage extends BaseMessage {
  type: EventType.ON_MESSAGE;
  send: (text: string, keyboard?: KeyboardBuilder) => Promise<void>;
  placeholder: (text: string, keyboard?: KeyboardBuilder) => Promise<void>;
}

export interface VkTextMessage extends BaseTextMessage {
  from: SocialSource.VK;
  isConversation: boolean;
}

export interface TelegramTextMessage extends BaseTextMessage {
  from: SocialSource.TELEGRAM;
}

export interface BaseInlineButtonMessage {
  userId: number;
  from: SocialSource;
  type: EventType.ON_INLINE_BUTTON;
  edit: (text: string, alertText?: string, keyboard?: KeyboardBuilder) => Promise<void>;
}

export interface TelegramInlineButtonMessage extends BaseInlineButtonMessage {
  from: SocialSource.TELEGRAM;
  alert: (text: string, force?: boolean) => Promise<void>;
}

export interface VkInlineButtonMessage extends BaseInlineButtonMessage {
  from: SocialSource.VK;
  payload: any;
  alert: (text: string) => Promise<void>;
}
