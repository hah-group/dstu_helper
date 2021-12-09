import { KeyboardBuilder } from 'vk-io/lib/structures/keyboard/builder';

export type BotResponse = BotTextResponse | BotEventResponse;

export interface BotTextResponse {
  type: 'text';
  text: string;
  keyboard?: KeyboardBuilder;
  reply?: boolean;
}

export interface BotEventResponse {
  type: 'event';
  text: string;
}
