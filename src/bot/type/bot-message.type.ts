export interface BotMessage extends VkBotMessage {
  isMentioned: boolean;
  isConversation: boolean;
  isButton: boolean;
  payload: any;
}
