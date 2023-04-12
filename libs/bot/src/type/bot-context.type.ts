//TODO FIX IT!!
import { UserEntity } from '../../../../apps/dstu-helper/src/modules/user/user.entity';
import { BotPayloadType } from './bot-payload-type.enum';

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

export type CoreMetadata = {
  requestTime?: number;
};

export type BotExtendedContext<T = any> = BotContext & {
  botMetadata?: T;
  coreMetadata?: CoreMetadata;
};

export type BotContext = BotBaseContext & {
  payload: BotContextPayload;
};

export interface BotMessagePayload {
  type: BotPayloadType.MESSAGE;
  text: string;
  messageId: number;
}

export interface BotInlineKeyPayload {
  type: BotPayloadType.INLINE_KEY;
  key: string;
  messageId: number;
}

export type BotChatEventPayload = BotChatParticipantEventPayload;

export interface BotChatParticipantEventPayload {
  type: BotPayloadType.CHAT_EVENT;
  eventType: 'invite' | 'kick';
  members: ChatUser[];
}
