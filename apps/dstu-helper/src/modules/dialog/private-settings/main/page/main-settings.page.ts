import { PageMenu } from '../../../../../../../../libs/common/src/menu/type/page.menu';
import { Text } from '../../../../../framework/text/text';

export class MainSettingsPage extends PageMenu {
  constructor() {
    super(Text.Build('settings-main-header'), 'settings-main');
  }
}
