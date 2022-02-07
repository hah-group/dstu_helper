import { User } from '../user/user.entity';

export interface TelegramMessageData {
  text: string;
  user: User;
  username?: string;
  lastMessageId?: number;
}
