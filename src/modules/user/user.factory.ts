import { User } from './user.entity';
import Prisma from '@prisma/client';
import { SocialSource } from '../bot/type/social.enum';
import { UserStage } from './user-stage.enum';
import { UserMenu } from './user-menu/user-menu.entity';

export class UserFactory {
  public static createNew(id: number, firstName: string, lastName: string, socialType: SocialSource): User {
    return new User({
      id,
      firstName,
      lastName,
      groupId: null,
      socialType,
      stage: UserStage.INITIAL,
      menu: new UserMenu(),
      locale: 'ru',
    });
  }

  public static create(user: Prisma.User): User {
    const { id, firstName, lastName, groupId, socialType, stage, locale } = user;
    return new User({
      id,
      firstName,
      lastName,
      groupId,
      socialType: <SocialSource>socialType,
      stage: <UserStage>stage,
      menu: new UserMenu(<any>user.menu),
      locale: locale,
    });
  }
}
