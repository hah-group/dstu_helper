import { LessonType } from '@prisma/client';

export const LessonTypeDefinition = {
  пр: LessonType.PRACTICAL,
  Пра: LessonType.PRACTICAL,
  лек: LessonType.LECTURE,
  лаб: LessonType.LABORATORY,
  экз: LessonType.EXAMINATION,
  зач: LessonType.EXAM_WITHOUT_MARK,
  зчО: LessonType.EXAM_WITHOUT_MARK,
};
