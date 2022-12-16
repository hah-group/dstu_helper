import { Module } from '@nestjs/common';
import { TeacherRepository } from './teacher.repository';
import { TeacherEntity } from './teacher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherEntity])],
  providers: [TeacherRepository],
  exports: [TeacherRepository],
})
export class TeacherModule {}
