import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';
import { TeacherEntity } from '../../../modules/schedule/teacher/teacher.entity';

export class TeacherHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('teacher', (teacher: TeacherEntity, opts) => {
      return teacher.render(false);
    });
  }
}
