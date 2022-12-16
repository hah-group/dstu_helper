import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { AudienceEntity } from './audience.entity';
import { MikroORM } from '@mikro-orm/core';
import { CoreRepository } from '@dstu_helper/common';

export class AudienceRepository extends CoreRepository<AudienceEntity> {
  constructor(@InjectRepository(AudienceEntity) repository: EntityRepository<AudienceEntity>, orm: MikroORM) {
    super(repository, orm);
  }
}
