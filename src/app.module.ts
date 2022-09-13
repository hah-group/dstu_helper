import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule as CronModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './framework/database/database.module';
import { BotModule } from './framework/bot/bot.module';
import { TelegramModule } from './framework/telegram/telegram.module';
import { DialogModule } from './modules/dialog/dialog.module';
import { UserModule } from './modules/user/user.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CronModule.forRoot(),
    EventEmitterModule.forRoot(),
    DatabaseModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    BotModule,
    TelegramModule.registerAsync({
      token: process.env.TG_BOT_TOKEN,
    }),
    DialogModule,
    UserModule,
    /*BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    VkModule.registerAsync({
      token: process.env.BOT_TOKEN,
      groupId: parseInt(process.env.GROUP_ID),
      confirmation: process.env.CONFIRMATION,
    }),
    TelegramModule.registerAsync({
      token: process.env.TG_BOT_TOKEN,
    }),
    BotModule,
    PrismaModule,
    StudyGroupModule,
    CacheModule,
    DstuModule,
    ConversationModule,
    UserModule,
    LessonModule,
    TeacherModule,
    PrivateScheduleModule,
    SetupBotModule,
    SystemNotificationModule,
    ConversationBotModule,
    BotExceptionModule,*/
  ],
})
export class AppModule {
  private readonly log = new Logger('App');

  constructor() {
    this.log.log(`Application starting with version: ${process.env.npm_package_version}`);
  }

  configure(consumer: MiddlewareConsumer): any {
    //if (process.env.USE_POLLING == 'false') consumer.apply(VkMiddleware).forRoutes('bot/vk');
  }
}
