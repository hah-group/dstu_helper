/*
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StudyGroup } from './study-group.entity';
import { StudyGroupFactory } from './study-group.factory';
import { PrismaPromise } from '@prisma/client';
import { User } from '../user/user.entity';

export type BatchPayload = {
  count: number;
};

@Injectable()
export class StudyGroupService {
  constructor(private prismaService: PrismaService) {}

  public async getByUser(user: User): Promise<StudyGroup | undefined> {
    if (!user.groupId) return;

    const record = await this.prismaService.studyGroup.findUnique({
      where: {
        id: user.groupId,
      },
      include: {
        Lessons: {
          include: {
            Teacher: true,
          },
        },
        Users: true,
      },
    });

    if (!record) return;

    const { Lessons, Users, ...params } = record;
    return StudyGroupFactory.create(record, Lessons, Users);
  }

  public async getById(id: number): Promise<StudyGroup | undefined> {
    const record = await this.prismaService.studyGroup.findUnique({
      where: {
        id: id,
      },
      include: {
        Lessons: {
          include: {
            Teacher: true,
          },
        },
        Users: true,
      },
    });

    if (!record) return;

    const { Lessons, Users, ...params } = record;
    return StudyGroupFactory.create(record, Lessons, Users);
  }

  public async getAll(): Promise<StudyGroup[]> {
    const records = await this.prismaService.studyGroup.findMany({
      where: {},
      include: {
        Lessons: {
          include: {
            Teacher: true,
          },
        },
        Users: true,
      },
    });

    return records.map((record) => {
      const { Lessons, Users, ...params } = record;
      return StudyGroupFactory.create(record, Lessons, Users);
    });
  }

  public save(entity: StudyGroup): PrismaPromise<any> {
    const data = {
      name: entity.name,
      id: entity.id,
      updateStatus: entity.updateStatus,
      /!*Lessons:
        entity.lessons.length > 0
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
          : undefined,*!/
      Users: {
        connect: entity.users.map((user) => ({ id: user.id })),
      },
    };

    return this.prismaService.studyGroup.upsert({
      where: {
        name: entity.name,
      },
      create: data,
      update: data,
    });
  }

  public async clearUnused(): Promise<BatchPayload> {
    const users = await this.prismaService.user.findMany({
      where: {
        groupId: {
          not: null,
        },
      },
    });
    return this.prismaService.studyGroup.deleteMany({
      where: {
        id: {
          notIn: users.map((user) => user.groupId),
        },
      },
    });
  }

  public async saveMany(entities: StudyGroup[]): Promise<any[]> {
    return this.prismaService.$transaction(entities.map((group) => this.save(group)));
  }
}
*/
