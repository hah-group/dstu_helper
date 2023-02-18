import { ANY_DATE, OnMessageFunction } from '@dstu_helper/common';

import { AtDefinition } from './definition/at-definition';
import { IsBanWordExist } from './definition/ban-definition';
import { NomMoreLessonDefinition } from './definition/lesson-definition';

export const AT_ACTIVATION = new RegExp(`^${NomMoreLessonDefinition}( (${AtDefinition}))?( (${ANY_DATE}))+$`, 'gi');

export const AtActivation: OnMessageFunction = (message: string) =>
  !IsBanWordExist(message) && !!message.match(AT_ACTIVATION);
