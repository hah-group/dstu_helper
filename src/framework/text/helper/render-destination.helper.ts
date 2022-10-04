import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';
import { LessonEntity } from '../../../modules/lesson/lesson.entity';

export class RenderDestinationHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('renderDestination', (params, opts) => {
      const stringBuilder: string[] = [];

      if (params.subgroup) stringBuilder.push(`${params.subgroup} п/г: `);
      if (params.classRoom && params.corpus) stringBuilder.push(`${params.corpus}-${params.classRoom}`);
      else if (params.classRoom) stringBuilder.push(params.classRoom);
      else stringBuilder.push(params.corpus);

      return stringBuilder.join('');
    });
  }
}
