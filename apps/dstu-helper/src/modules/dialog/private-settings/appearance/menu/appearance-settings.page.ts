import { Text } from '../../../../../framework/text/text';
import { PageMenu } from '@dstu_helper/common';

export class AppearanceSettingsPage extends PageMenu {
  constructor() {
    super(Text.Build('appearance-settings-header'), 'appearance-settings');
  }
}
