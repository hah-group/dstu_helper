export interface TelegramMessageData {
  text: string;
  user: {
    firstName: string;
    lastName: string;
    id: number;
  };
  lastMessageId?: number;
}
