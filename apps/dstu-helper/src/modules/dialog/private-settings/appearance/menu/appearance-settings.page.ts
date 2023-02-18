import { Content, PageMenu } from '@dstu_helper/common';

export class AppearanceSettingsPage extends PageMenu {
  constructor() {
    super(Content.Build('appearance-settings-header'), 'appearance-settings');
  }
}
