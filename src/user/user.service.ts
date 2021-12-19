import { Injectable } from '@nestjs/common';
import { VkIoService } from 'src/vk-io/vk-io.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './user.entity';
import { UserFactory } from './user.factory';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService, private readonly vkIoService: VkIoService) {}

  public async get(id: number): Promise<User> {
    const record = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!record) return this.createNew(id);
    else return UserFactory.create(record);
  }

  private async createNew(id: number): Promise<User> {
    const [userInfo] = await this.vkIoService.api.users.get({
      user_ids: `${id}`,
    });

    const userEntity = UserFactory.createNew(id, userInfo.first_name, userInfo.last_name);

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
