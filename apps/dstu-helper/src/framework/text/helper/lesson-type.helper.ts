import { LessonType } from 'apps/dstu-helper/src/modules/schedule/lesson/lesson-type.enum';
import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';

export class LessonTypeHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('lessonType', (a: LessonType, opts) => {
      switch (a) {
        case LessonType.LECTURE:
          return '📔 Лекция:';
        case LessonType.PRACTICAL:
          return '📕 Практика:';
        case LessonType.LABORATORY:
          return '🔬 Лабораторная:';
        case LessonType.EXAMINATION:
          return '📝 Экзамен:';
        case LessonType.EXAM_WITHOUT_MARK:
          return '📝 Зачет:';
        case LessonType.PHYSICAL_EDUCATION:
          return '🏃‍';
        case LessonType.NON_TYPE:
          return '📕';
      }
    });
  }
}
