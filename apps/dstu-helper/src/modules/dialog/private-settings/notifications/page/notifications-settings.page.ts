import { PageMenu } from '@dstu_helper/common';
import { Text } from '../../../../../framework/text/text';

export class NotificationsSettingsPage extends PageMenu {
  constructor() {
    super(Text.Build('notifications-settings-header'), 'notifications-settings');
  }
}
