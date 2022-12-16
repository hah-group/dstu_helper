import { UserEntity } from './user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { MikroORM } from '@mikro-orm/core';
import { CoreRepository } from '@dstu_helper/common';

export class UserRepository extends CoreRepository<UserEntity> {
  constructor(@InjectRepository(UserEntity) repository: EntityRepository<UserEntity>, orm: MikroORM) {
    super(repository, orm);
  }
}
