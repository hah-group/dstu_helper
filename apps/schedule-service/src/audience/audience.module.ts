import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AudienceEntity } from './audience.entity';
import { AudienceRepository } from './audience.repository';

@Module({
  imports: [MikroOrmModule.forFeature([AudienceEntity])],
  providers: [AudienceRepository],
  exports: [AudienceRepository],
})
export class AudienceModule {}
