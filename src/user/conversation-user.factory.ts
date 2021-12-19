import Prisma, { Role } from '@prisma/client';
import { ConversationUser } from './conversation-user.entity';
import { User } from './user.entity';

export class ConversationUserFactory {
  public static create(params: Prisma.ConversationUser & { User: Prisma.User }): ConversationUser {
    const { User, role } = params;
    return new ConversationUser({
      role,
      ...User,
    });
  }

  public static createNew(user: User, role: Role): ConversationUser {
    return new ConversationUser({
      role: role,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      groupId: user.groupId,
    });
  }
}
