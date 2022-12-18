import { TextFilter } from './text-filter.base';
import * as lodash from 'lodash';
import { SubjectInfo } from '../lesson.parser';

export class TextFilterBuilder {
  private readonly fns: TextFilter<SubjectInfo>[];

  constructor(fns: TextFilter<SubjectInfo>[]) {
    this.fns = fns;
  }

  public execute(input: string): SubjectInfo {
    let result = {};

    for (const fn of this.fns) {
      const res = fn(input);
      result = lodash.merge(result, res.result);
      input = res.filtered.trim();
    }

    return <SubjectInfo>{
      ...result,
      name: input,
    };
  }
}
