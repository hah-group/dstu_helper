import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AudienceEntity } from './audience.entity';
import { AudienceRepository } from './audience.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AudienceEntity])],
  providers: [AudienceRepository],
  exports: [AudienceRepository],
})
export class AudienceModule {}
