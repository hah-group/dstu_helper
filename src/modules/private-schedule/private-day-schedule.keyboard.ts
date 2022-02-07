import { KeyboardBuilder } from '../bot/keyboard/keyboard.builder';
import { TextButton } from '../bot/keyboard/text.button';
import { DateTime } from '../util/time';
import { TextProcessor } from '../util/text.processor';

export const PrivateDaySchedulePreviousDayButtonId = 'DAY_SCHEDULE_PREVIOUS_DAY';
export const PrivateDayScheduleTodayButtonId = 'DAY_SCHEDULE_TODAY_DAY';
export const PrivateDayScheduleNextDayButtonId = 'DAY_SCHEDULE_NEXT_DAY';

export const PrivateDaySchedulePreviousWeekButtonId = 'DAY_SCHEDULE_PREVIOUS_WEEK';
export const PrivateDayScheduleNextWeekButtonId = 'DAY_SCHEDULE_NEXT_WEEK';

export const PrivateDayScheduleKeyboard = (atDate: DateTime) => {
  return new KeyboardBuilder()
    .add(new TextButton(TextProcessor.atDateButton(atDate, -1), PrivateDaySchedulePreviousDayButtonId))
    .add(new TextButton(TextProcessor.atDateButton(atDate, 0), PrivateDayScheduleTodayButtonId))
    .add(new TextButton(TextProcessor.atDateButton(atDate, 1), PrivateDayScheduleNextDayButtonId))
    .row()
    .add(new TextButton(TextProcessor.atDateButton(atDate, -7), PrivateDaySchedulePreviousWeekButtonId))
    .add(new TextButton(TextProcessor.atDateButton(atDate, 7), PrivateDayScheduleNextWeekButtonId))
    .inline();
};
