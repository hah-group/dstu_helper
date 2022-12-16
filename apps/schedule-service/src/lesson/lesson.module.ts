import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LessonRepository } from './lesson.repository';
import { LessonEntity } from './lesson.entity';

@Module({
  imports: [MikroOrmModule.forFeature([LessonEntity])],
  providers: [LessonRepository],
  exports: [LessonRepository],
})
export class LessonModule {}
