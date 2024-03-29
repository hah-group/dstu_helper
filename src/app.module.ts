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
import { GroupModule } from './modules/group/group.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { UniversityModule } from './modules/university/university.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { SceneModule } from './framework/scene/scene.module';
import { VkModule } from './framework/vk/vk.module';
import { ReleaseModule } from './modules/release/release.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CronModule.forRoot(),
    EventEmitterModule.forRoot(),
    DatabaseModule.forRoot(),
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
      confirmation: process.env.VK_BOT_CONFIRMATION,
    }),
    DialogModule,
    ScheduleModule,
    UserModule,
    GroupModule,
    LessonModule,
    TeacherModule,
    UniversityModule,
    ConversationModule,
    SceneModule,
    ReleaseModule,
  ],
})
export class AppModule {
  private readonly log = new Logger('App');

  constructor() {
    this.log.log(`Application starting with version: ${process.env.npm_package_version}`);
  }
}
