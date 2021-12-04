export interface BotMessage extends VkBotMessage {
  isMentioned: boolean;
  isConversation: boolean;
}
