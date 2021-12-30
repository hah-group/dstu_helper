import { Module } from '@nestjs/common';
import { SystemNotificationService } from './system-notification.service';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  providers: [SystemNotificationService],
  imports: [TelegramModule],
})
export class SystemNotificationModule {}
