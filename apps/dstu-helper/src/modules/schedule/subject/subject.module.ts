import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubjectEntity } from './subject.entity';
import { SubjectRepository } from './subject.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity])],
  providers: [SubjectRepository],
  exports: [SubjectRepository],
})
export class SubjectModule {}
