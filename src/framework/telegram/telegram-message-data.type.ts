import { User } from '../../old_modules/user/user.entity';

export interface TelegramMessageData {
  text: string;
  user: User;
  username?: string;
  lastMessageId?: number;
}
