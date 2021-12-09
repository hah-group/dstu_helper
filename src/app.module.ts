import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VkIoModule } from './vk-io/vk-io.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudyGroupModule } from './study-group/study-group.module';
import { CacheModule } from './cache/cache.module';
import { DstuModule } from './dstu/dstu.module';
import { BotModule } from './bot/bot.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { ConversationModule } from './conversation/conversation.module';
import { UserModule } from './user/user.module';
import { LessonModule } from './lesson/lesson.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    VkIoModule.registerAsync({
      token: process.env.BOT_TOKEN,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    PrismaModule,
    StudyGroupModule,
    CacheModule,
    DstuModule,
    BotModule,
    ConversationModule,
    UserModule,
    LessonModule,
    TeacherModule,
  ],
})
export class AppModule {}
