import { UserConversation, UserConversationArgs } from './user-conversation.entity';
import { Role } from '@prisma/client';
import { Conversation } from '../conversation/conversation.entity';

export class UserConversationFactory {
  public static create(params: UserConversationArgs): UserConversation {
    return new UserConversation(params);
  }

  public static createNew(role: Role, conversation: Conversation): UserConversation {
    return new UserConversation({
      role: role,
      id: conversation.id,
      title: conversation.title,
      settings: conversation.settings,
    });
  }
}
