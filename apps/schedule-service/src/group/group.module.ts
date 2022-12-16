import { Module } from '@nestjs/common';
import { GroupEntity } from './group.entity';
import { GroupRepository } from './group.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonEntity } from '../lesson/lesson.entity';
import { FacultyEntity } from '../faculty/faculty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, FacultyEntity])],
  providers: [GroupRepository],
  exports: [GroupRepository],
})
export class GroupModule {}
