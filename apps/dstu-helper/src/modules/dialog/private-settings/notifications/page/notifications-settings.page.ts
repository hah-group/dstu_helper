import { Content, PageMenu } from '@dstu_helper/common';

export class NotificationsSettingsPage extends PageMenu {
  constructor() {
    super(Content.Build('notifications-settings-header'), 'notifications-settings');
  }
}
