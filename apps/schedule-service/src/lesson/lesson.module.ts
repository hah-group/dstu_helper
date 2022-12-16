import { Module } from '@nestjs/common';
import { LessonRepository } from './lesson.repository';
import { LessonEntity } from './lesson.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from '../subject/subject.entity';
import { TeacherEntity } from '../teacher/teacher.entity';
import { GroupEntity } from '../group/group.entity';
import { AudienceEntity } from '../audience/audience.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LessonEntity, SubjectEntity, TeacherEntity, GroupEntity, AudienceEntity])],
  providers: [LessonRepository],
  exports: [LessonRepository],
})
export class LessonModule {}
