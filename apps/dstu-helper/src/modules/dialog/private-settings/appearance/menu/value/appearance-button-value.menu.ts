import { ButtonValueMenu, Content } from '@dstu_helper/common';

//TODO Fix it
import { AppearanceParams } from '../../../../../user/user-properties/appearance.property';

export class AppearanceButtonValueMenu extends ButtonValueMenu {
  constructor(type: AppearanceParams) {
    super(Content.Build('appearance-settings-value-buttons', { type }), type);
  }
}
