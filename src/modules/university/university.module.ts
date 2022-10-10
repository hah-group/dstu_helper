import { Module } from '@nestjs/common';
import { UniversityRepository } from './university.repository';
import { UniversityEntity } from './university.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([UniversityEntity])],
  providers: [UniversityRepository],
  exports: [UniversityRepository],
})
export class UniversityModule {}
