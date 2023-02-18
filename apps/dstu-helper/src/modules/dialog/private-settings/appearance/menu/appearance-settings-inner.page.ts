import { Content, PageMenu } from '@dstu_helper/common';

export class AppearanceSettingsInnerPage extends PageMenu<any> {
  constructor(type: string) {
    super(Content.Build('appearance-settings-headers', { type: type }), `appearance-settings-${type}-content`);
  }
}
