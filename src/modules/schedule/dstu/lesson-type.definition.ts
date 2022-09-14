import { LessonType } from '@prisma/client';

export const LessonTypeDefinition = {
  пр: LessonType.PRACTICAL,
  пра: LessonType.PRACTICAL,
  фв: LessonType.PRACTICAL,
  лек: LessonType.LECTURE,
  лаб: LessonType.LABORATORY,
  экз: LessonType.EXAMINATION,
  зач: LessonType.EXAM_WITHOUT_MARK,
  зчо: LessonType.EXAM_WITHOUT_MARK,
};
