import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';

@Module({
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
