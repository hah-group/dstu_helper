import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VkModule } from './vk/vk.module';
import { TelegramModule } from './telegram/telegram.module';
import { BotModule } from './bot/bot.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './prisma/prisma.module';
import { StudyGroupModule } from './study-group/study-group.module';
import { CacheModule } from './cache/cache.module';
import { DstuModule } from './dstu/dstu.module';
import { ConversationModule } from './conversation/conversation.module';
import { UserModule } from './user/user.module';
import { LessonModule } from './lesson/lesson.module';
import { TeacherModule } from './teacher/teacher.module';
import { PrivateScheduleModule } from './private-schedule/private-schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    VkModule.registerAsync({
      token: process.env.BOT_TOKEN,
      groupId: parseInt(process.env.GROUP_ID),
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
  ],
  providers: [],
})
export class AppModule {}
