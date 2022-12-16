import { NomMoreLessonDefinition } from './definition/lesson-definition';
import { AtDefinition } from './definition/at-definition';
import { ANY_DATE } from '../../../../framework/util/date-parser/date.parser';
import { OnMessageFunction } from '../../../../framework/bot/decorator/on-message.decorator';
import { IsBanWordExist } from './definition/ban-definition';

export const AT_ACTIVATION = new RegExp(`^${NomMoreLessonDefinition}( (${AtDefinition}))?( (${ANY_DATE}))+$`, 'gi');

export const AtActivation: OnMessageFunction = (message: string) =>
  !IsBanWordExist(message) && !!message.match(AT_ACTIVATION);
