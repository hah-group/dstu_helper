import { User } from './user.entity';
import Prisma from '@prisma/client';

export class UserFactory {
  public static createNew(id: number, firstName: string, lastName: string): User {
    return new User({
      id,
      firstName,
      lastName,
      groupId: null,
    });
  }

  public static create(user: Prisma.User): User {
    const { id, firstName, lastName, groupId } = user;
    return new User({
      id,
      firstName,
      lastName,
      groupId,
    });
  }
}
