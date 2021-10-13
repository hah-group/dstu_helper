import { LessonType } from '@prisma/client';

export const LessonTypeDefinition = {
  пр: LessonType.PRACTICAL,
  лек: LessonType.LECTURE,
  лаб: LessonType.LABORATORY,
};
