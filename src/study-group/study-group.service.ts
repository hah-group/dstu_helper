import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudyGroup } from './study-group.entity';
import { StudyGroupFactory } from './study-group.factory';
import { PrismaPromise } from '@prisma/client';

@Injectable()
export class StudyGroupService {
  constructor(private prismaService: PrismaService) {}

  public async getAll(ignoreLessons = false): Promise<StudyGroup[]> {
    const includes = {
      Lessons: {
        include: {
          Teacher: true,
        },
      },
    };

    const records = await this.prismaService.studyGroup.findMany({
      where: {},
      include: ignoreLessons ? undefined : includes,
    });

    return records.map((record) => {
      return StudyGroupFactory.create(record);
    });
  }

  /*public async setUpdatingFlag(flag: boolean, groupId?: number): Promise<void> {
    await this.prismaService.studyGroup.updateMany({
      where: { groupId },
      data: {
        updateStatus: flag,
      },
    });
  }

  public async findGroup(groupName: string): Promise<StudyGroup | undefined> {
    const result = await this.prismaService.studyGroup.findUnique({
      where: {
        name: groupName,
      },
    });

    if (!result) {
      const groupInfo = await this.cacheService.findGroup(groupName);
      if (!groupInfo) return undefined;
      const group = await this.prismaService.studyGroup.create({
        data: {
          updateStatus: false,
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
    await this.prismaService.usersGroup.upsert({
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
    const group = await this.prismaService.usersGroup.findUnique({
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
    return this.prismaService.studyGroup.findMany({});
  }

  public async update(data: GroupWithScheduleFullType): Promise<void> {
    const group = await this.prismaService.studyGroup.findUnique({
      where: {
        groupId: data.groupId,
      },
    });
    await this.prismaService.schedule.deleteMany({
      where: {
        groupId: group.id,
      },
    });

    await this.prismaService.studyGroup.update({
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
  }*/

  public save(entity: StudyGroup): PrismaPromise<any> {
    const data = {
      name: entity.name,
      id: entity.id,
      updateStatus: entity.updateStatus,
      Lessons: entity.lessons
        ? entity.lessons.map((lesson) => {
            return {
              connectOrCreate: {
                where: {
                  id: lesson.id,
                },
                create: {
                  id: lesson.id,
                  start: lesson.start,
                  end: lesson.end,
                  isTopWeek: lesson.isTopWeek,
                  type: lesson.type,
                  order: lesson.order,
                  name: lesson.name,
                  subgroup: lesson.subgroup,
                  subsection: lesson.subsection,
                  corpus: lesson.corpus,
                  classRoom: lesson.classRoom,
                  distance: lesson.distance,
                  Teacher: {
                    connectOrCreate: {
                      where: {
                        id: lesson.teacher.id,
                      },
                      create: {
                        id: lesson.teacher.id,
                        firstName: lesson.teacher.firstName,
                        lastName: lesson.teacher.lastName,
                        middleName: lesson.teacher.middleName,
                      },
                    },
                  },
                },
              },
            };
          })
        : undefined,
    };

    return this.prismaService.studyGroup.upsert({
      where: {
        id: entity.id,
      },
      create: data,
      update: data,
    });
  }

  public async saveMany(entities: StudyGroup[]): Promise<void> {
    this.prismaService.$transaction(entities.map((group) => this.save(group)));
  }
}
