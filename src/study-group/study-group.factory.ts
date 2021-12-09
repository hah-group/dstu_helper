import { StudyGroup, StudyGroupArgs } from './study-group.entity';
import Prisma from '@prisma/client';
import { LessonFactory } from '../lesson/lesson.factory';

export class StudyGroupFactory {
  public static create(
    params: Omit<StudyGroupArgs, 'lessons'>,
    lessons?: (Prisma.Lesson & { Teacher: Prisma.Teacher })[],
  ): StudyGroup {
    return new StudyGroup({
      ...params,
      lessons: lessons
        ? lessons.map((record) => {
            const { Teacher, ...lesson } = record;
            return LessonFactory.create(lesson, Teacher);
          })
        : undefined,
    });
  }
}
