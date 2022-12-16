import { TextFilter } from './text-filter.base';
import { normalizeWhiteSpaces } from 'normalize-text';
import { SubjectInfo } from '../lesson.parser';

const firstLetterUpper = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const SubsectionTextFilter: TextFilter<SubjectInfo> = (input) => {
  input = input.replace(/ *\( */, ' (');
  input = input.replace(/ *\) */, ') ');
  input = input.replace(/ ?\/ ?/, '/');
  input = input.replace(/ ?([\.,])/g, '$1 ');
  input = input.replace(/([А-ЯЁ\d]\.) /g, '$1');
  input = normalizeWhiteSpaces(input.trim());

  const textClearRegex = new RegExp(/[^а-яёa-z+#]$/gi);

  const regex = new RegExp(/\((.*?)\)([^ ]|$)/, 'i');
  const match = input.match(regex);

  if (match && match[1]) {
    const subsection = firstLetterUpper(match[1].trim());
    return {
      result: {
        subsection: subsection,
      },
      filtered: input.replace(regex, '').replace(textClearRegex, ''),
    };
  } else {
    return {
      result: {
        subsection: undefined,
      },
      filtered: input.replace(textClearRegex, ''),
    };
  }
};
