import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './user.entity';
import { UserFactory } from './user.factory';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async get(id: number): Promise<User> {
    const record = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    if (record) return UserFactory.create(record);
  }

  private async createNew(id: number, firstName: string, lastName: string): Promise<User> {
    const userEntity = UserFactory.createNew(id, firstName, lastName);

    const data = {
      id: userEntity.id,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
    };
    const record = await this.prismaService.user.upsert({
      where: {
        id,
      },
      create: data,
      update: data,
    });

    return UserFactory.create(record);
  }

  public async save(entity: User): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: entity.id,
      },
      data: {
        firstName: entity.firstName,
        lastName: entity.lastName,
        groupId: entity.groupId,
      },
    });
  }
}
