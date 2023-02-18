import { BotModule, DatabaseModule, SceneModule } from '@dstu_helper/common';
import { BullModule } from '@nestjs/bull';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule as CronModule } from '@nestjs/schedule';

import { TelegramModule } from './framework/telegram/telegram.module';
import { VkModule } from './framework/vk/vk.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { DialogModule } from './modules/dialog/dialog.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ReleaseModule } from './modules/release/release.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CronModule.forRoot(),
    EventEmitterModule.forRoot(),
    DatabaseModule.forRoot('app'),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    BotModule,
    TelegramModule.registerAsync({
      token: process.env.TG_BOT_TOKEN || '',
    }),
    VkModule.registerAsync({
      token: process.env.VK_BOT_TOKEN || '',
      groupId: parseInt(process.env.VK_BOT_ID || '1'),
    }),
    DialogModule,
    UserModule,
    ConversationModule,
    SceneModule,
    ReleaseModule,
    ScheduleModule,
    NotificationModule,
  ],
})
export class AppModule {
  private readonly log = new Logger('App');

  constructor() {
    this.log.log(`Application starting with version: ${process.env.npm_package_version}`);
  }
}
