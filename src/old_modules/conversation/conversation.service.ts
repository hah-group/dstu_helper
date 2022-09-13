import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Conversation } from './conversation.entity';
import { ConversationFactory } from './conversation.factory';
import { Nullable } from '../util/nullable';
import { SocialType } from '@prisma/client';

@Injectable()
export class ConversationService {
  constructor(private readonly prismaService: PrismaService) {}

  public async get(id: number): Promise<Nullable<Conversation>> {
    const data = await this.prismaService.conversation.findUnique({
      where: {
        id: id,
      },
      include: {
        ConversationUsers: {
          include: {
            User: true,
          },
        },
      },
    });

    if (!data) return null;

    const { ConversationUsers, ...conversation } = data;
    return ConversationFactory.create(conversation, ConversationUsers);
  }

  public async getAll(): Promise<Conversation[]> {
    const data = await this.prismaService.conversation.findMany({
      include: {
        ConversationUsers: {
          include: {
            User: true,
          },
        },
      },
    });

    return data.map((record) => {
      const { ConversationUsers, ...conversation } = record;
      return ConversationFactory.create(conversation, ConversationUsers);
    });
  }

  public async save(entity: Conversation): Promise<void> {
    const data = {
      id: entity.id,
      title: entity.title,
      settings: entity.settings,
      status: entity.status,
      ConversationUsers: {
        connectOrCreate: entity.users.map((user) => {
          return {
            where: {
              userId_conversationId: {
                userId: user.id,
                conversationId: entity.id,
              },
            },
            create: {
              role: user.role,
              User: {
                connectOrCreate: {
                  where: {
                    id: user.id,
                  },
                  create: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    socialType: <SocialType>user.socialType,
                  },
                },
              },
            },
          };
        }),
      },
    };

    await this.prismaService.conversation.upsert({
      where: {
        id: entity.id,
      },
      create: data,
      update: data,
    });
  }
}
