import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeacherEntity } from './teacher.entity';
import { TeacherRepository } from './teacher.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherEntity])],
  providers: [TeacherRepository],
  exports: [TeacherRepository],
})
export class TeacherModule {}
