import { PageMenu } from '../../../../../../../../libs/common/src/menu/type/page.menu';
import { Text } from '../../../../../framework/text/text';

export class NotificationsSettingsInnerPage extends PageMenu<any> {
  constructor(type: string) {
    super(Text.Build('notifications-settings-headers', { type: type }), `notifications-settings-${type}-content`);
  }
}
