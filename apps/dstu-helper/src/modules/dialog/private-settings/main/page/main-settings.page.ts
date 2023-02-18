import { Content, PageMenu } from '@dstu_helper/common';

export class MainSettingsPage extends PageMenu {
  constructor() {
    super(Content.Build('settings-main-header'), 'settings-main');
  }
}
