/*
import { SocialSource } from './social.enum';
import { KeyboardBuilder } from '../keyboard/keyboard.builder';
import { EventType } from './metadata-type.enum';
import { User } from '../../../old_modules/user/user.entity';
import { ProcessedText, ProcessedTextInstance } from '../../../old_modules/util/text.processor';
import { OnMessageEventItem } from '../decorator/on-message.decorator';

export type TextMessage = VkTextMessage | TelegramTextMessage;
export type InlineButtonMessage = TelegramInlineButtonMessage | VkInlineButtonMessage;
export type InviteMessage = VkInviteMessage;
export type Message = TextMessage | InlineButtonMessage | InviteMessage;

interface BaseMessage {
  text: string;
  user: User;
  from: SocialSource;
  type: EventType;
}

interface BaseTextMessage extends BaseMessage {
  type: EventType.ON_MESSAGE;
  send: (text: ProcessedText, keyboard?: KeyboardBuilder, forceNew?: boolean) => Promise<void>;
  placeholder: (text: ProcessedText, keyboard?: KeyboardBuilder) => Promise<void>;
}

export interface VkTextMessage extends BaseTextMessage {
  from: SocialSource.VK;
  isConversation: boolean;
  peerId: number;
  valueHandled: OnMessageEventItem;
}

export interface TelegramTextMessage extends BaseTextMessage {
  from: SocialSource.TELEGRAM;
  valueHandled: OnMessageEventItem;
}

export interface BaseInlineButtonMessage {
  user: User;
  from: SocialSource;
  type: EventType.ON_INLINE_BUTTON;
  send: (text: ProcessedText, keyboard?: KeyboardBuilder, forceNew?: boolean) => Promise<void>;
  edit: (text: ProcessedText, alertText?: ProcessedTextInstance, keyboard?: KeyboardBuilder) => Promise<void>;
}

export interface TelegramInlineButtonMessage extends BaseInlineButtonMessage {
  from: SocialSource.TELEGRAM;
  alert: (text: ProcessedTextInstance, force?: boolean) => Promise<void>;
}

export interface VkInlineButtonMessage extends BaseInlineButtonMessage {
  from: SocialSource.VK;
  peerId: number;
  payload: any;
  alert: (text: ProcessedTextInstance) => Promise<void>;
}

export interface VkInviteMessage {
  from: SocialSource.VK;
  fromUser: User;
  invitedUser?: User;
  type: EventType.ON_INVITE;
  peerId: number;
  send: (text: ProcessedText, keyboard?: KeyboardBuilder) => Promise<void>;
}
*/
