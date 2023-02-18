import { Content, KeyboardBuilder, TextButton } from '@dstu_helper/common';

export const SettingsNotificationsButton = new TextButton(
  Content.Build('settings-main-buttons', { type: 'notifications' }),
);
export const SettingsAppearanceButton = new TextButton(Content.Build('settings-main-buttons', { type: 'appearance' }));
export const SettingsBanListButton = new TextButton(Content.Build('settings-main-buttons', { type: 'ban_list' }));
export const SettingsMultiGroupsButton = new TextButton(
  Content.Build('settings-main-buttons', { type: 'multi_groups' }),
);
export const SettingsResetButton = new TextButton(Content.Build('settings-main-buttons', { type: 'reset' }));
export const SettingsGuideButton = new TextButton(Content.Build('settings-main-buttons', { type: 'guide' }));
export const SettingsBackButton = new TextButton(Content.Build('settings-main-buttons', { type: 'back' }));

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
