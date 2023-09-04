import { OnMessageFunction } from '@dstu_helper/common';
import { ANY_DATE } from '@dstu_helper/common';

import { IsBanWordExist } from './definition/ban-definition';
import { GenMoreLessonDefinition } from './definition/lesson-definition';

export const SCHEDULE_ACTIVATION = new RegExp(
  `^расписание( ${GenMoreLessonDefinition})?(( (${ANY_DATE}))|( на (${ANY_DATE})))?$`,
  'gi',
);

export const ScheduleActivation: OnMessageFunction = (message: string) =>
  !IsBanWordExist(message) && !!message.match(SCHEDULE_ACTIVATION);
