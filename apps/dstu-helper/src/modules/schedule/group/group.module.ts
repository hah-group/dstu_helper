import { Module } from '@nestjs/common';
import { GroupEntity } from './group.entity';
import { GroupRepository } from './group.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacultyEntity } from '../faculty/faculty.entity';
import { GroupController } from './group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, FacultyEntity])],
  providers: [GroupRepository],
  exports: [GroupRepository],
  controllers: [GroupController],
})
export class GroupModule {}
