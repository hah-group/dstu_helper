import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { SubjectEntity } from './subject.entity';
import { MikroORM } from '@mikro-orm/core';
import { CoreRepository } from '@dstu_helper/common';

export class SubjectRepository extends CoreRepository<SubjectEntity> {
  constructor(@InjectRepository(SubjectEntity) repository: EntityRepository<SubjectEntity>, orm: MikroORM) {
    super(repository, orm);
  }
}
