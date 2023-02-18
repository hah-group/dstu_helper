import { Content, DateTime, KeyboardBuilder, TextButton, Time } from '@dstu_helper/common';

type DateContextItem = (currentDate?: DateTime) => any;

export const CurrentDateButton: DateContextItem = (date = Time.get()) =>
  new TextButton(Content.Build('date-button', { atDate: date, offset: 0 }), 'button_marker_current_day');

export const NextDayButton: DateContextItem = (date = Time.get()) =>
  new TextButton(Content.Build('date-button', { atDate: date, offset: 1 }), 'button_marker_next_day');
export const PrevDayButton: DateContextItem = (date = Time.get()) =>
  new TextButton(Content.Build('date-button', { atDate: date, offset: -1 }), 'button_marker_prev_day');

export const NextWeekButton: DateContextItem = (date = Time.get()) =>
  new TextButton(Content.Build('date-button', { atDate: date, offset: 7 }), 'button_marker_next_week');
export const PrevWeekButton: DateContextItem = (date = Time.get()) =>
  new TextButton(Content.Build('date-button', { atDate: date, offset: -7 }), 'button_marker_prev_week');

export const TodayButton: DateContextItem = () =>
  new TextButton(Content.Build('return-today-button', { atDate: Time.get(), offset: 0 }), 'button_marker_today');

export const ScheduleKeyboard: DateContextItem = (date) => {
  const kB = new KeyboardBuilder()
    .inline()
    .add(PrevDayButton(date))
    .add(CurrentDateButton(date))
    .add(NextDayButton(date))
    .row()
    .add(PrevWeekButton(date))
    .add(NextWeekButton(date));

  if (!date?.isSame(Time.get(), 'd')) kB.row().add(TodayButton());

  return kB;
};
