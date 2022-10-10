import { OnMessageFunction } from '../../../../framework/bot/decorator/on-message.decorator';
import { ANY_DATE } from '../../../../framework/util/date-parser/date.parser';
import { WhatDefinition } from './definition/question-definition';
import { IsBanWordExist } from './definition/ban-definition';

export const WHAT_ACTIVATION = new RegExp(
  `(${WhatDefinition})( (за|по|у нас|(${ANY_DATE})|на ${ANY_DATE}))* (парам|пары)( на)?( (${ANY_DATE}))?$`,
  'gi',
);

export const WhatActivation: OnMessageFunction = (message: string) =>
  !IsBanWordExist(message) && !!message.match(WHAT_ACTIVATION);
