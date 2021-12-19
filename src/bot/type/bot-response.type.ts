import { KeyboardBuilder } from 'vk-io/lib/structures/keyboard/builder';

export type BotCallbackResult = BotResponse | BotManyResponse;
export type BotResponse = BotMessageResponse | BotReplyResponse | BotEventResponse;
export type BotManyResponse = BotResponse[];
export type BotAnyResponse = BotResponse | BotManyResponse | undefined;

export interface BotMessageResponse {
  type: 'message';
  text: string;
  keyboard?: KeyboardBuilder;
  directPrivate?: boolean;
}

export interface BotReplyResponse {
  type: 'reply';
  text: string;
}

export interface BotEventResponse {
  type: 'event';
  text: string;
}
