import { WhereDefinition, WhichDefinition } from './definition/question-definition';
import { NomLessonDefinition } from './definition/lesson-definition';
import { NomAudienceDefinition } from './definition/audience-definition';

export const WHERE_AUDIENCE = new RegExp(
  `^(${[WhereDefinition, WhichDefinition].join('|')}) (идти|${NomLessonDefinition}|${NomAudienceDefinition})`,
  'gi',
);

export const NEXT_AUDIENCE = /^(какая |где |что )?(некст|следующая|след пара)( пара)?/gi;
