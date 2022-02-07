import { Module } from '@nestjs/common';
import { DstuService } from './dstu.service';
import { BullModule } from '@nestjs/bull';
import { DstuProducer } from './job/dstu.producer';
import { DstuConsumer } from './job/dstu.consumer';
import { StudyGroupModule } from 'src/modules/study-group/study-group.module';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'dstu',
      limiter: {
        max: 2,
        duration: 1000,
      },
    }),
    StudyGroupModule,
    LessonModule,
  ],
  providers: [DstuService, DstuProducer, DstuConsumer],
  exports: [DstuService],
})
export class DstuModule {}
