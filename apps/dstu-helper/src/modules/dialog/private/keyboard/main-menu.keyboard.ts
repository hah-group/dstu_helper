import { KeyboardBuilder, TextButton } from '@dstu_helper/common';
import { Content } from '@dstu_helper/common';

export const ScheduleButton = new TextButton(Content.Build('schedule-button'));
export const WhereAudienceButton = new TextButton(Content.Build('where-audience-button'));
export const WhereNextAudienceButton = new TextButton(Content.Build('where-next-audience-button'));
export const ScheduleAtWeekButton = new TextButton(Content.Build('schedule-at-week-button'));
export const SettingsButton = new TextButton(Content.Build('settings-button'));

export const MainMenuKeyboard = new KeyboardBuilder()
  .add(ScheduleButton)
  .row()
  .add(WhereAudienceButton)
  .add(WhereNextAudienceButton)
  .row()
  .add(SettingsButton);
