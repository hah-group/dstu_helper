import * as Handlebars from 'handlebars';
import { BaseHelper } from './base.helper';
import { AudienceEntity } from '../../../modules/schedule/audience/audience.entity';

export class LessonDestinationHelper extends BaseHelper {
  public register(): void {
    Handlebars.registerHelper('audience', (a: AudienceEntity | AudienceEntity[] | undefined) => {
      if (!a) return;

      if (Array.isArray(a)) {
        const corpusExist = a.some((audience) => !!audience.corpus);
        const audiences = a.map((audience) => audience.render()).join(', ');
        return `${corpusExist ? '🏢 Аудитории:' : '🏢'} ${audiences}`;
      }

      const corpusExist = !!a.corpus;
      return `${corpusExist ? '🏢 Аудитория:' : '🏢'} ${a.render()}`;
    });
  }
}
