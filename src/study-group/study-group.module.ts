import { forwardRef, Module } from '@nestjs/common';
import { StudyGroupService } from './study-group.service';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [forwardRef(() => CacheModule)],
  providers: [StudyGroupService],
  exports: [StudyGroupService],
})
export class StudyGroupModule {}
