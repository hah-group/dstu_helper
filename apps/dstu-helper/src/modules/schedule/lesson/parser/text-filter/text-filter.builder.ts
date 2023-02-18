import { lodash } from '@dstu_helper/common';

import { SubjectInfo } from '../lesson.parser';
import { TextFilter } from './text-filter.base';

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
