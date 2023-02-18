import { lodash } from '@dstu_helper/common';

import { SubjectInfo } from '../lesson.parser';
import { TextFilter } from './text-filter.base';

export const SubgroupTextFilter: TextFilter<SubjectInfo> = (input) => {
  const regex = new RegExp(/, п\/г (\d)$/, 'i');

  const match = input.match(regex);
  if (match && match[1]) {
    const subgroup = lodash.parseInt(match[1]);
    return {
      result: {
        subgroup: lodash.isNaN(subgroup) ? undefined : subgroup,
      },
      filtered: input.replace(regex, ''),
    };
  } else {
    return {
      result: {
        subgroup: undefined,
      },
      filtered: input,
    };
  }
};
