import { ANY_DATE, OnMessageFunction } from '@dstu_helper/common';

import { IsBanWordExist } from './definition/ban-definition';
import { WhatDefinition } from './definition/question-definition';

export const WHAT_ACTIVATION = new RegExp(
  `(${WhatDefinition})( (за|по|у нас|(${ANY_DATE})|на ${ANY_DATE}))* (парам|пары)( на)?( (${ANY_DATE}))?$`,
  'gi',
);

export const WhatActivation: OnMessageFunction = (message: string) =>
  !IsBanWordExist(message) && !!message.match(WHAT_ACTIVATION);
