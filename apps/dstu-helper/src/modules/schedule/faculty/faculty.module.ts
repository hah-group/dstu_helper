import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FacultyEntity } from './faculty.entity';
import { FacultyRepository } from './faculty.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FacultyEntity])],
  providers: [FacultyRepository],
  exports: [FacultyRepository],
})
export class FacultyModule {}
