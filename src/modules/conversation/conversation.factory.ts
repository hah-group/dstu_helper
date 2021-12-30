import { Conversation } from './conversation.entity';
import Prisma from '@prisma/client';
import { ConversationUserFactory } from '../user/conversation-user.factory';
import { ConversationUser } from '../user/conversation-user.entity';

export class ConversationFactory {
  public static createNew(id: number): Conversation {
    return new Conversation({
      id,
      title: null,
      settings: {},
      users: new Map(),
      status: 'NOT_CONFIGURED',
    });
  }

  public static create(
    conversation: Prisma.Conversation,
    users: (Prisma.ConversationUser & { User: Prisma.User })[],
  ): Conversation {
    const userEntities: Map<number, ConversationUser> = new Map<number, ConversationUser>();
    users.forEach((record) => {
      userEntities.set(record.User.id, ConversationUserFactory.create(record));
    });

    return new Conversation({
      id: conversation.id,
      title: conversation.title,
      settings: conversation.settings,
      status: conversation.status,
      users: userEntities,
    });
  }
}
