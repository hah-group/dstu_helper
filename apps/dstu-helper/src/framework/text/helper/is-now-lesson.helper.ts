import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';
import { TimeOrderProcessor } from '../../util/time-order/time-order.processor';
import { LessonEntity } from '../../../modules/schedule/lesson/lesson.entity';
import { LessonInterval } from '../../../modules/schedule/schedule-provider/lesson-interval';
import { Time } from '@dstu_helper/common';

export class IsNowLessonHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('isNowLesson', (lessons: LessonEntity | LessonEntity[]) => {
      const lesson = Array.isArray(lessons) ? lessons[0] : lessons;
      const currentOrder = TimeOrderProcessor.now(LessonInterval, true);

      if (Time.get().isSame(lesson.start, 'day') && currentOrder == lesson.order) return '(Сейчас)';
    });
  }
}
