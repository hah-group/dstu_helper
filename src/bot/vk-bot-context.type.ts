export interface VkBotContextType {
  message: VkBotMessage;
  eventId: number;
  groupId: number;
  match?: RegExp;
  /**
   * @deprecated
   */
  client_info?: VkBotClientInfo;
  clientInfo?: VkBotClientInfo;
  bot: VkBot;
  /**
   * Only if Session middleware is used
   * @requires node-vk-bot-api/lib/session
   */
  session?: any;
  /**
   * Only if Stage middleware is used
   * @requires node-vk-bot-api/lib/stage
   */
  scene?: {
    enter(name: string, step?: number);
    leave(): void;
    next(): void;
    selectStep(index: number);
  };

  reply(message: string, attachment?: string | string[], markup?: VkBotKeyboard, sticker?: number | string): void;
}
