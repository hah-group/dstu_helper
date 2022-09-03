import { CoreRepository } from '../../framework/repository/core.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { TeacherEntity } from './teacher.entity';

export class TeacherRepository extends CoreRepository<TeacherEntity> {
  constructor(@InjectRepository(TeacherEntity) repository: EntityRepository<TeacherEntity>) {
    super(repository);
  }
}
