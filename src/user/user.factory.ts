import { User } from './user.entity';
import Prisma from '@prisma/client';
import { UserConversation } from './user-conversation.entity';
import { UserConversationFactory } from './user-conversation.factory';

export class UserFactory {
  public static createNew(id: number, firstName: string, lastName: string): User {
    return new User({
      id,
      firstName,
      lastName,
      group: null,
      conversations: new Map(),
    });
  }

  public static create(
    user: Prisma.User,
    conversations: (Prisma.ConversationUser & { Conversation: Prisma.Conversation })[],
  ): User {
    const { id, firstName, lastName } = user;
    const userConversations: Map<number, UserConversation> = new Map<number, UserConversation>();
    conversations.forEach((record) => {
      const userConversation = UserConversationFactory.create({
        id: record.Conversation.id,
        settings: record.Conversation.settings,
        title: record.Conversation.title,
        role: record.role,
      });
      userConversations.set(record.Conversation.id, userConversation);
    });
    return new User({
      id,
      firstName,
      lastName,
      group: null,
      conversations: userConversations,
    });
  }
}
