import { BotPayloadType } from './bot-payload-type.enum';

export interface ChatUser {
  id: number;
  firstName?: string;
  lastName?: string;
  nickname?: string;
}

export type ChatScope = 'private' | 'conversation';

export interface Chat {
  id: number;
  scope: ChatScope;
}

export type BotContextPayload = BotMessagePayload | BotChatEventPayload | BotInlineKeyPayload;

export interface BotContext {
  provider: string;
  from: ChatUser;
  chat: Chat;
  payload: BotContextPayload;
}

export interface BotMessagePayload {
  type: BotPayloadType.MESSAGE;
  message: string;
}

export interface BotInlineKeyPayload {
  type: BotPayloadType.INLINE_KEY;
  key: string;
}

export type BotChatEventPayload = BotChatParticipantEventPayload;

export interface BotChatParticipantEventPayload {
  type: BotPayloadType.CHAT_EVENT;
  eventType: 'invite' | 'kick';
  members: ChatUser[];
}
