import { PageMenu } from '../../../../../../../../libs/common/src/menu/type/page.menu';
import { Text } from '../../../../../framework/text/text';

export class AppearanceSettingsInnerPage extends PageMenu<any> {
  constructor(type: string) {
    super(Text.Build('appearance-settings-headers', { type: type }), `appearance-settings-${type}-content`);
  }
}
