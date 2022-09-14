/*
import { StudyGroup } from './study-group.entity';
import Prisma from '@prisma/client';
import { LessonFactory } from '../lesson/lesson.factory';
import { UserFactory } from '../user/user.factory';
import { User } from 'src/old_modules/user/user.entity';

export class StudyGroupFactory {
  public static create(
    params: Prisma.StudyGroup,
    lessons: (Prisma.Lesson & { Teacher: Prisma.Teacher })[],
    users: Prisma.User[],
  ): StudyGroup {
    const userEntities: Map<number, User> = new Map<number, User>();
    users.forEach((record) => {
      userEntities.set(record.id, UserFactory.create(record));
    });
    return new StudyGroup({
      ...params,
      lessons: lessons.map((record) => {
        const { Teacher, ...lesson } = record;
        return LessonFactory.create(lesson, Teacher);
      }),
      users: userEntities,
    });
  }

  public static createNew(id: number, name: string): StudyGroup {
    return new StudyGroup({
      id,
      name,
      updateStatus: 'IN_PROGRESS',
      users: new Map(),
      lessons: [],
    });
  }
}
*/
