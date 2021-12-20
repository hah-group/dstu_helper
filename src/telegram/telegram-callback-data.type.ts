export interface TelegramCallbackData {
  text?: string;
  user: {
    firstName: string;
    lastName: string;
    id: number;
  };
  callbackId: string;
  messageId?: number;
  data?: string;
  lastMessageId?: number;
}
