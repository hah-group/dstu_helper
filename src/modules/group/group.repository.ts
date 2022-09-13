import { CoreRepository } from '../../framework/repository/core.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { GroupEntity } from './group.entity';
import { MikroORM } from '@mikro-orm/core';

export class GroupRepository extends CoreRepository<GroupEntity> {
  constructor(@InjectRepository(GroupEntity) repository: EntityRepository<GroupEntity>, orm: MikroORM) {
    super(repository, orm);
  }
}
