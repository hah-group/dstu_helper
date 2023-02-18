import { Time } from '@dstu_helper/common';
import * as Handlebars from 'handlebars';

//TODO FIX IT!!
import { LessonEntity } from '../../../../../apps/dstu-helper/src/modules/schedule/lesson/lesson.entity';
import { TimeOrderProcessor } from '../../../../../apps/dstu-helper/src/modules/schedule/processor/lesson-time-order/time-order.processor';
import { BaseHelper } from './util/base.helper';

export class IsNowLessonHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('isNowLesson', (lessons: LessonEntity | LessonEntity[]) => {
      const lesson = Array.isArray(lessons) ? lessons[0] : lessons;
      const currentOrder = TimeOrderProcessor.now(true);

      if (Time.get().isSame(lesson.start, 'day') && currentOrder == lesson.order) return '(Сейчас)';
    });
  }
}
