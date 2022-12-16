import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { FacultyEntity } from './faculty.entity';
import { MikroORM } from '@mikro-orm/core';
import { CoreRepository } from '@dstu_helper/common';

export class FacultyRepository extends CoreRepository<FacultyEntity> {
  constructor(@InjectRepository(FacultyEntity) repository: EntityRepository<FacultyEntity>, orm: MikroORM) {
    super(repository, orm);
  }
}
