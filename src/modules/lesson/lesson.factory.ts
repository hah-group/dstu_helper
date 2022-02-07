import { Teacher } from '@prisma/client';
import { Lesson, LessonArgs } from './lesson.entity';
import { TeacherFactory } from '../teacher/teacher.factory';
import { TeacherArgs } from '../teacher/teacher.entity';

export class LessonFactory {
  public static create(lesson: Omit<LessonArgs, 'teacher' | 'id'>, teacher?: Teacher | TeacherArgs): Lesson {
    return new Lesson({
      ...lesson,
      teacher: teacher ? TeacherFactory.create(teacher) : undefined,
    });
  }
}
