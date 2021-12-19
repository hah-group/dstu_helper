import { KeyboardBuilder } from 'vk-io/lib/structures/keyboard/builder';

export interface BotMessage extends VkBotMessage {
  isMentioned: boolean;
  isConversation: boolean;
  placeholder: (text: string, keyboard?: KeyboardBuilder) => Promise<void>;
}

export interface BotEvent {
  userId: number;
  peerId: number;
  payload: any;
  isConversation: boolean;
  placeholder: (text: string, keyboard?: KeyboardBuilder) => Promise<void>;
  edit: (text: string, keyboard?: KeyboardBuilder) => Promise<void>;
}
