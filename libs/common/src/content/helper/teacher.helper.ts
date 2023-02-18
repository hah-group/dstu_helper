import * as Handlebars from 'handlebars';

//TODO FIX IT!!
import { TeacherEntity } from '../../../../../apps/dstu-helper/src/modules/schedule/teacher/teacher.entity';
import { BaseHelper } from './util/base.helper';

export class TeacherHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('teacher', (teacher: TeacherEntity, opts) => {
      return teacher.render(false);
    });
  }
}
