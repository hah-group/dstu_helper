import { CoreRepository } from '@dstu_helper/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupEntity } from './group.entity';

export class GroupRepository extends CoreRepository<GroupEntity> {
  constructor(@InjectRepository(GroupEntity) repository: Repository<GroupEntity>) {
    super(repository);
  }
}
