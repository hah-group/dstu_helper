import { CoreRepository } from '../../framework/repository/core.repository';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

export class UserRepository extends CoreRepository<UserEntity> {
  constructor(@InjectRepository(UserEntity) repository: EntityRepository<UserEntity>) {
    super(repository);
  }
}
