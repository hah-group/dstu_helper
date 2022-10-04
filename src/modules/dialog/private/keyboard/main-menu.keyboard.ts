import { KeyboardBuilder } from '../../../../framework/bot/keyboard/keyboard.builder';
import { TextButton } from '../../../../framework/bot/keyboard/text.button';
import { Text } from '../../../../framework/text/text';

export const ScheduleButton = new TextButton(Text.Build('schedule-button'));
export const ScheduleAtWeekButton = new TextButton(Text.Build('schedule-at-week-button'));
export const SettingsButton = new TextButton(Text.Build('settings-button'));
export const MainMenuKeyboard = new KeyboardBuilder().add(ScheduleButton).row().add(SettingsButton);
