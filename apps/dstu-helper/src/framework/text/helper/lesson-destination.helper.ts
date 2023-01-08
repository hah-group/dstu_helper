import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';
import { LessonEntity } from '../../../modules/schedule/lesson/lesson.entity';

export class LessonDestinationHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('getDestination', (a: LessonEntity, opts) => {
      return a.audience?.render();
      //TODO Добавить логику иконки
    });
  }
}
