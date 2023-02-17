import { KeyboardBuilder } from '../../../../../framework/bot/keyboard/keyboard.builder';
import { TextButton } from '../../../../../framework/bot/keyboard/text.button';
import { Text } from '../../../../../framework/text/text';

export const SettingsNotificationsButton = new TextButton(
  Text.Build('settings-main-buttons', { type: 'notifications' }),
);
export const SettingsAppearanceButton = new TextButton(Text.Build('settings-main-buttons', { type: 'appearance' }));
export const SettingsBanListButton = new TextButton(Text.Build('settings-main-buttons', { type: 'ban_list' }));
export const SettingsMultiGroupsButton = new TextButton(Text.Build('settings-main-buttons', { type: 'multi_groups' }));
export const SettingsResetButton = new TextButton(Text.Build('settings-main-buttons', { type: 'reset' }));
export const SettingsGuideButton = new TextButton(Text.Build('settings-main-buttons', { type: 'guide' }));
export const SettingsBackButton = new TextButton(Text.Build('settings-main-buttons', { type: 'back' }));

export const SettingsMainKeyboard = new KeyboardBuilder()
  .add(SettingsNotificationsButton)
  .add(SettingsAppearanceButton)
  .row()
  .add(SettingsBanListButton)
  .add(SettingsMultiGroupsButton)
  .row()
  .add(SettingsResetButton)
  .add(SettingsGuideButton)
  .row()
  .add(SettingsBackButton);
