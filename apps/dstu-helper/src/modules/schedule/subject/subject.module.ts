import { Module } from '@nestjs/common';
import { SubjectEntity } from './subject.entity';
import { SubjectRepository } from './subject.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity])],
  providers: [SubjectRepository],
  exports: [SubjectRepository],
})
export class SubjectModule {}
