import { MenuModule } from '@dstu_helper/common';
import { Module } from '@nestjs/common';

import { NotificationModule } from '../../notification/notification.module';
import { UserModule } from '../../user/user.module';
import { PrivateSetupModule } from '../private/private-setup.module';
import { AppearanceSettingsHandler } from './appearance/appearance-settings.handler';
import { SettingsMenu } from './main/menu.list';
import { PrivateSettingsMainHandler } from './main/private-settings-main.handler';
import { NotificationsSettingsHandler } from './notifications/notifications-settings.handler';

@Module({
  imports: [UserModule, PrivateSetupModule, MenuModule.register({ menu: SettingsMenu }), NotificationModule],
  providers: [PrivateSettingsMainHandler, NotificationsSettingsHandler, AppearanceSettingsHandler],
})
export class PrivateSettingsModule {}
