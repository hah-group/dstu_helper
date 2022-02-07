import { Module } from '@nestjs/common';
import { StudyGroupService } from './study-group.service';

@Module({
  providers: [StudyGroupService],
  exports: [StudyGroupService],
})
export class StudyGroupModule {}
