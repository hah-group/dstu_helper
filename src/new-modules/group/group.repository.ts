import { CoreRepository } from '../../framework/repository/core.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { GroupEntity } from './group.entity';

export class GroupRepository extends CoreRepository<GroupEntity> {
  constructor(@InjectRepository(GroupEntity) repository: EntityRepository<GroupEntity>) {
    super(repository);
  }
}
