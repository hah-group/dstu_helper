import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AudienceEntity } from '../audience/audience.entity';
import { GroupEntity } from '../group/group.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { TeacherEntity } from '../teacher/teacher.entity';
import { LessonEntity } from './lesson.entity';
import { LessonRepository } from './lesson.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LessonEntity, SubjectEntity, TeacherEntity, GroupEntity, AudienceEntity])],
  providers: [LessonRepository],
  exports: [LessonRepository],
})
export class LessonModule {}
