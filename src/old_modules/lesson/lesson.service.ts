/*
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/old_modules/prisma/prisma.service';
import { Lesson } from './lesson.entity';
import { PrismaPromise } from '@prisma/client';
import { BatchPayload } from '../study-group/study-group.service';

@Injectable()
export class LessonService {
  private readonly log = new Logger('LessonService');

  constructor(private readonly prismaService: PrismaService) {}

  public async deleteAll(): Promise<BatchPayload> {
    return this.prismaService.lesson.deleteMany();
  }

  public save(entity: Lesson): PrismaPromise<any> {
    const entityId = entity.id;
    const teacherData = {
      id: entity.teacher.id,
      firstName: entity.teacher.firstName,
      lastName: entity.teacher.lastName,
      middleName: entity.teacher.middleName,
    };

    const data = {
      id: entityId,
      start: entity.start,
      end: entity.end,
      isTopWeek: entity.isTopWeek,
      type: entity.type,
      order: entity.order,
      name: entity.name,
      subgroup: entity.subgroup,
      subsection: entity.subsection,
      corpus: entity.corpus,
      classRoom: entity.classRoom,
      distance: entity.distance,
      Group: {
        connect: {
          id: entity.groupId,
        },
      },
      Teacher: {
        connectOrCreate: {
          where: {
            id: entity.teacher.id,
          },
          create: teacherData,
        },
      },
    };

    const updateData = {
      ...data,
      Teacher: {
        upsert: {
          update: teacherData,
          create: teacherData,
        },
      },
    };

    return this.prismaService.lesson.upsert({
      where: {
        id: entityId,
      },
      create: data,
      update: updateData,
    });
  }

  public async saveMany(entities: Lesson[]): Promise<void> {
    try {
      await this.prismaService.$transaction(entities.map((lesson) => this.save(lesson)));
    } catch (e) {
      this.log.error(`Transaction error`);
      this.log.error(e.stack);
      throw e;
    }
  }
}
*/
