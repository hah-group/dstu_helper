import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SubjectEntity } from './subject.entity';
import { SubjectRepository } from './subject.repository';

@Module({
  imports: [MikroOrmModule.forFeature([SubjectEntity])],
  providers: [SubjectRepository],
  exports: [SubjectRepository],
})
export class SubjectModule {}
