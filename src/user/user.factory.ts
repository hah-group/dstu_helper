import { User } from './user.entity';
import Prisma from '@prisma/client';
import { SocialSource } from '../bot/social.enum';

export class UserFactory {
  public static createNew(id: number, firstName: string, lastName: string, socialType: SocialSource): User {
    return new User({
      id,
      firstName,
      lastName,
      groupId: null,
      socialType,
    });
  }

  public static create(user: Prisma.User): User {
    const { id, firstName, lastName, groupId, socialType } = user;
    return new User({
      id,
      firstName,
      lastName,
      groupId,
      socialType: <SocialSource>socialType,
    });
  }
}
