import { TextFilter } from './text-filter.base';
import { normalizeWhiteSpaces } from 'normalize-text';
import { SubjectInfo } from '../lesson.parser';

export const firstLetterUpper = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const EXTRACT_BRACKETS = /\((.*)\)/g;

export const FinalTextFilter: TextFilter<SubjectInfo> = (input) => {
  input = input.replace(/ *\( */, ' (');
  input = input.replace(/ *\) */, ') ');
  input = input.replace(/ ?\/ ?/, '/');
  input = input.replace(/ ?([\.,])/g, '$1 ');
  input = input.replace(/([А-ЯЁ\d]\.) /g, '$1');
  input = input.replace(/- и /g, ' и ');
  input = input.replace(/ *- */g, '-');
  input = normalizeWhiteSpaces(input.trim());

  const bracketsMatch = input.match(EXTRACT_BRACKETS);
  if (!bracketsMatch) {
    input = input.replace(/[()]*/g, '');
  }

  const textClearRegex = new RegExp(/[^а-яёa-z+#\d"()]$/gi);

  return {
    result: {},
    filtered: firstLetterUpper(input.replace(textClearRegex, '')),
  };
};
