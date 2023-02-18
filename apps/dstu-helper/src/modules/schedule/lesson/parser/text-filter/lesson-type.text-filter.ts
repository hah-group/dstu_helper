import { LessonType } from '../../lesson-type.enum';
import { SubjectInfo } from '../lesson.parser';
import { LessonTypeDefinition } from '../lesson-type.definition';
import { TextFilter } from './text-filter.base';

const getLessonTypes = () => {
  return Object.keys(LessonTypeDefinition).join('|');
};

export const LessonTypeTextFilter: TextFilter<SubjectInfo> = (input) => {
  const keys = getLessonTypes();
  const regex = new RegExp(`^(${keys})\.?`, 'i');

  const match = input.match(regex);
  if (match && match[1]) {
    const type = LessonTypeDefinition[match[1].toLowerCase()];
    return {
      result: { type: type },
      filtered: input.replace(regex, ''),
    };
  } else {
    return {
      result: { type: LessonType.NON_TYPE },
      filtered: input,
    };
  }
};
