import { Module } from '@nestjs/common';
import { TeacherRepository } from './teacher.repository';
import { TeacherEntity } from './teacher.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([TeacherEntity])],
  providers: [TeacherRepository],
  exports: [TeacherRepository],
})
export class TeacherModule {}
