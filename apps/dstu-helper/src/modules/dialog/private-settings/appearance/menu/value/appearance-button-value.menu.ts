import { ButtonValueMenu } from '@dstu_helper/common';
import { Text } from '../../../../../../framework/text/text';
import { AppearanceParams } from '../../../../../user/user-properties/appearance.property';

export class AppearanceButtonValueMenu extends ButtonValueMenu {
  constructor(type: AppearanceParams) {
    super(Text.Build('appearance-settings-value-buttons', { type }), type);
  }
}
