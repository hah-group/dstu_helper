import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { DstuModule } from '../dstu/dstu.module';
import { CacheController } from './cache.controller';
import { LessonModule } from '../lesson/lesson.module';
import { StudyGroupModule } from '../study-group/study-group.module';

@Module({
  providers: [CacheService],
  imports: [DstuModule, LessonModule, StudyGroupModule],
  controllers: [CacheController],
  exports: [CacheService],
})
export class CacheModule {}
