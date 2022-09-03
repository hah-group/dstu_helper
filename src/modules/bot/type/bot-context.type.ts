export interface ChatUser {
  id: number;
  firstName?: string;
  lastName?: string;
  nickname?: string;
}

export interface Chat {
  id: number;
  type: 'private' | 'conversation';
}

export interface BotContext {
  provider: string;
  from: ChatUser;
  chat: Chat;
  payload: BotMessagePayload | BotChatEventPayload | BotInlineKeyPayload;
}

export interface BotMessagePayload {
  type: 'message';
  message: string;
}

export interface BotInlineKeyPayload {
  type: 'inline_key';
  key: string;
}

export type BotChatEventPayload = BotChatParticipantEventPayload;

export interface BotChatParticipantEventPayload {
  type: 'chat_event';
  eventType: 'invite' | 'kick';
  members: ChatUser[];
}
