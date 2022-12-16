import { OnMessageFunction } from '../../../../framework/bot/decorator/on-message.decorator';
import { ANY_DATE } from '../../../../framework/util/date-parser/date.parser';
import { GenMoreLessonDefinition } from './definition/lesson-definition';
import { IsBanWordExist } from './definition/ban-definition';

export const SCHEDULE_ACTIVATION = new RegExp(
  `^расписание( ${GenMoreLessonDefinition})?(( (${ANY_DATE}))|( на (${ANY_DATE})))?$`,
  'gi',
);

export const ScheduleActivation: OnMessageFunction = (message: string) =>
  !IsBanWordExist(message) && !!message.match(SCHEDULE_ACTIVATION);
