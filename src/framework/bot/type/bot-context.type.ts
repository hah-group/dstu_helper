import { BotPayloadType } from './bot-payload-type.enum';
import { UserEntity } from '../../../modules/user/user.entity';

export interface ChatUser {
  id: number;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  user: UserEntity;
}

export type ChatScope = 'private' | 'conversation';

export interface Chat {
  id: number;
  scope: ChatScope;
}

export type BotContextPayload = BotMessagePayload | BotChatEventPayload | BotInlineKeyPayload;

export interface BotBaseContext {
  provider: string;
  botId: number;
  from: ChatUser;
  chat: Chat;
}

export type BotExtendedContext<T> = BotContext & {
  metadata: T;
};

export type BotContext = BotBaseContext & {
  payload: BotContextPayload;
};

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
