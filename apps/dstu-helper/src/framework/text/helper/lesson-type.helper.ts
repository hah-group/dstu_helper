import { LessonType } from 'apps/dstu-helper/src/modules/schedule/lesson/lesson-type.enum';
import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';

export class LessonTypeHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('lessonType', (a: LessonType, opts) => {
      return a;
      //TODO Fix texts
    });
  }
}
