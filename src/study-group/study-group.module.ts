import { forwardRef, Module } from '@nestjs/common';
import { StudyGroupService } from './study-group.service';
import { UniversityModule } from '../university/university.module';

@Module({
  providers: [StudyGroupService],
  exports: [StudyGroupService],
})
export class StudyGroupModule {}
