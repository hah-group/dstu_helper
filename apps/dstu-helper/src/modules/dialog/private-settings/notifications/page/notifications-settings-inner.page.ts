import { Content, PageMenu } from '@dstu_helper/common';

export class NotificationsSettingsInnerPage extends PageMenu<any> {
  constructor(type: string) {
    super(Content.Build('notifications-settings-headers', { type: type }), `notifications-settings-${type}-content`);
  }
}
