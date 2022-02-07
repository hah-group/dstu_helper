import { User } from '../user/user.entity';

export interface TelegramCallbackData {
  text?: string;
  user: User;
  username?: string;
  callbackId: string;
  messageId?: number;
  data?: string;
  lastMessageId?: number;
}
