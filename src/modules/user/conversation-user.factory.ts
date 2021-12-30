import Prisma, { Role } from '@prisma/client';
import { ConversationUser } from './conversation-user.entity';
import { User } from './user.entity';
import { SocialSource } from '../bot/type/social.enum';
import { UserStage } from './user-stage.enum';
import { UserMenu } from './user-menu/user-menu.entity';

export class ConversationUserFactory {
  public static create(params: Prisma.ConversationUser & { User: Prisma.User }): ConversationUser {
    const { User, role } = params;
    return new ConversationUser({
      role,
      ...User,
      socialType: <SocialSource>User.socialType,
      stage: <UserStage>User.stage,
      menu: new UserMenu(<any>params.User.menu),
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
      stage: user.stage,
      menu: user.menu,
      locale: user.locale,
    });
  }
}
