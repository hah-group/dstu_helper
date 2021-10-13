import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Schedule, StudyGroup } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GroupWithScheduleFullType } from './group-with-schedule-full.type';
import * as moment from 'moment';
import { CacheService } from '../cache/cache.service';
import { CacheProducer } from '../cache/cache.producer';

@Injectable()
export class StudyGroupService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private cacheProducer: CacheProducer,
  ) {}

  public async setUpdatingFlag(flag: boolean, groupId?: number): Promise<void> {
    await this.prisma.studyGroup.updateMany({
      where: { groupId },
      data: {
        updating: flag,
      },
    });
  }

  public async findGroup(groupName: string): Promise<StudyGroup | undefined> {
    const result = await this.prisma.studyGroup.findUnique({
      where: {
        name: groupName,
      },
    });

    if (!result) {
      const groupInfo = await this.cacheService.findGroup(groupName);
      if (!groupInfo) return undefined;
      const group = await this.prisma.studyGroup.create({
        data: {
          updating: false,
          groupId: groupInfo.id,
          name: groupInfo.name,
        },
      });
      await this.cacheProducer.updateScheduleForGroup(group);
      return group;
    }

    return result;
  }

  public async addUserToGroup(group: StudyGroup, userId: number): Promise<void> {
    await this.prisma.usersGroup.upsert({
      where: { userId },
      update: {
        Group: {
          connect: {
            id: group.id,
          },
        },
      },
      create: {
        userId: userId,
        Group: {
          connect: {
            id: group.id,
          },
        },
      },
    });
  }

  public async studyGroup(userId: number, atDate: moment.Moment): Promise<GroupWithScheduleFullType> {
    const group = await this.prisma.usersGroup.findUnique({
      where: { userId },
      include: {
        Group: {
          include: {
            Schedule: {
              where: {
                end: {
                  lte: moment(atDate).endOf('d').toDate(),
                },
                start: {
                  gte: atDate.toDate(),
                },
              },
            },
          },
        },
      },
    });
    if (!group) throw new Error('Not found group');
    const data = group.Group;
    const result: Map<number, Schedule> = new Map<number, Schedule>();
    data.Schedule.map((lesson) => {
      result.set(lesson.lessonNumber, lesson);
    });

    const resultArray: Schedule[] = [];
    result.forEach((value) => resultArray.push(value));

    return {
      ...data,
      Schedule: resultArray,
    };
  }

  public async studyGroups(): Promise<StudyGroup[]> {
    return this.prisma.studyGroup.findMany({});
  }

  public async update(data: GroupWithScheduleFullType): Promise<void> {
    const group = await this.prisma.studyGroup.findUnique({
      where: {
        groupId: data.groupId,
      },
    });
    await this.prisma.schedule.deleteMany({
      where: {
        groupId: group.id,
      },
    });

    await this.prisma.studyGroup.update({
      where: {
        groupId: data.groupId,
      },
      data: {
        Schedule: {
          createMany: {
            data: data.Schedule.map((schedule) => {
              return {
                ...schedule,
              };
            }),
          },
        },
      },
    });
  }
}
