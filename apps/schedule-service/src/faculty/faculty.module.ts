import { Module } from '@nestjs/common';
import { FacultyEntity } from './faculty.entity';
import { FacultyRepository } from './faculty.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FacultyEntity])],
  providers: [FacultyRepository],
  exports: [FacultyRepository],
})
export class FacultyModule {}
