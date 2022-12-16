import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';
import { Time } from '../../util/time';
import { LessonEntity } from '../../../modules/lesson/lesson.entity';
import { TimeRelativeProcessor } from '../../util/time-relative.processor';

export class IsNowLessonHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('isNowLesson', (lessons: LessonEntity | LessonEntity[]) => {
      const lesson = Array.isArray(lessons) ? lessons[0] : lessons;
      const currentOrder = TimeRelativeProcessor.now(true);

      if (Time.get().isSame(lesson.start, 'day') && currentOrder == lesson.order) return '(Сейчас)';
    });
  }
}
