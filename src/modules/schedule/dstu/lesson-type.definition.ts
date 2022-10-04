import { LessonType } from '../../lesson/lesson-type.enum';

export const LessonTypeDefinition: Record<string, LessonType> = {
  пр: LessonType.PRACTICAL,
  пра: LessonType.PRACTICAL,
  фв: LessonType.PHYSICAL_EDUCATION,
  лек: LessonType.LECTURE,
  лаб: LessonType.LABORATORY,
  экз: LessonType.EXAMINATION,
  зач: LessonType.EXAM_WITHOUT_MARK,
  зчо: LessonType.EXAM_WITHOUT_MARK,
};
