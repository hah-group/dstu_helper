import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FacultyEntity } from '../faculty/faculty.entity';
import { GroupEntity } from './group.entity';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, FacultyEntity])],
  providers: [GroupRepository, GroupService],
  exports: [GroupRepository, GroupService],
})
export class GroupModule {}