import { Injectable } from '@nestjs/common';
import { VkIoService } from 'src/vk-io/vk-io.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './user.entity';
import { UserFactory } from './user.factory';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService, private readonly vkIoService: VkIoService) {}

  public async get(id: number): Promise<User> {
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
      include: {
        ConversationUsers: {
          include: {
            Conversation: true,
          },
        },
      },
    });

    const { ConversationUsers, ...user } = record;
    return UserFactory.create(user, ConversationUsers);
  }

  public async save(entity: User): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: entity.id,
      },
      data: {
        firstName: entity.firstName,
        lastName: entity.lastName,
        ConversationUsers: {
          connectOrCreate: entity.conversations.map((record) => {
            return {
              where: {
                userId_conversationId: {
                  userId: entity.id,
                  conversationId: record.id,
                },
              },
              create: {
                role: record.role,
                Conversation: {
                  connectOrCreate: {
                    where: {
                      id: record.id,
                    },
                    create: {
                      id: record.id,
                      title: record.title,
                      settings: record.settings,
                    },
                  },
                },
              },
            };
          }),
        },
      },
    });
  }
}
