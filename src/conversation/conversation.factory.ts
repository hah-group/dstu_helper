import { Conversation, ConversationArgs } from './conversation.entity';
import Prisma from '@prisma/client';
import { ConversationUser } from '../user/conversation-user.entity';
import { ConversationUserFactory } from '../user/conversation-user.factory';

export class ConversationFactory {
  public static createNew(id: number): Conversation {
    return new Conversation({ id, title: null, settings: {}, users: new Map() });
  }

  public static create(
    conversation: Prisma.Conversation,
    users: (Prisma.ConversationUser & { User: Prisma.User })[],
  ): Conversation {
    const userEntities: Map<number, ConversationUser> = new Map<number, ConversationUser>();
    users.forEach((record) => {
      userEntities.set(
        record.User.id,
        ConversationUserFactory.create({
          id: record.User.id,
          firstName: record.User.firstName,
          lastName: record.User.lastName,
          role: record.role,
          group: null,
        }),
      );
    });

    return new Conversation({
      id: conversation.id,
      title: conversation.title,
      settings: conversation.settings,
      users: userEntities,
    });
  }
}
