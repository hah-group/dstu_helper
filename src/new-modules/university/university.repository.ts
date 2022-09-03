import { CoreRepository } from '../../framework/repository/core.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UniversityEntity } from './university.entity';

export class UniversityRepository extends CoreRepository<UniversityEntity> {
  constructor(@InjectRepository(UniversityEntity) repository: EntityRepository<UniversityEntity>) {
    super(repository);
  }
}
