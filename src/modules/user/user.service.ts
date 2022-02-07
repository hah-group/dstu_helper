import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './user.entity';
import { UserFactory } from './user.factory';
import { SocialSource } from '../bot/type/social.enum';
import { SocialType } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async get(id: number, socialType: SocialSource): Promise<User> {
    const record = await this.prismaService.user.findFirst({
      where: {
        id: id,
        socialType: <SocialType>socialType,
      },
    });
    if (record) return UserFactory.create(record);
  }

  public async createNew(id: number, firstName: string, lastName: string, socialType: SocialSource): Promise<User> {
    const userEntity = UserFactory.createNew(id, firstName, lastName, socialType);

    const data = {
      id: userEntity.id,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      socialType: <SocialType>userEntity.socialType,
      menu: <any>userEntity.menu.toObject(),
      locale: userEntity.locale,
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
        socialType: entity.socialType,
        stage: entity.stage,
        menu: <any>entity.menu.toObject(),
        locale: entity.locale,
      },
    });
  }
}
