import { UserEntity } from './user.entity';
import { CoreV2Repository } from '@dstu_helper/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UserRepository extends CoreV2Repository<UserEntity> {
  constructor(@InjectRepository(UserEntity) repository: Repository<UserEntity>) {
    super(repository);
  }
}
