import { ChatSettings } from './chat-settings.type';
import { ProfileInfo } from './profile-info.type';

export interface ConversationInfo {
  chat: ChatSettings;
  profiles: ProfileInfo[];
}
