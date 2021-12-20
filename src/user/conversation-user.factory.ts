import Prisma, { Role } from '@prisma/client';
import { ConversationUser } from './conversation-user.entity';
import { User } from './user.entity';
import { SocialSource } from '../bot/social.enum';

export class ConversationUserFactory {
  public static create(params: Prisma.ConversationUser & { User: Prisma.User }): ConversationUser {
    const { User, role } = params;
    return new ConversationUser({
      role,
      ...User,
      socialType: <SocialSource>User.socialType,
    });
  }

  public static createNew(user: User, role: Role): ConversationUser {
    return new ConversationUser({
      role: role,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      groupId: user.groupId,
      socialType: user.socialType,
    });
  }
}
