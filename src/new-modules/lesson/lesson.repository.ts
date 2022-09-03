import { CoreRepository } from '../../framework/repository/core.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { LessonEntity } from './lesson.entity';

export class LessonRepository extends CoreRepository<LessonEntity> {
  constructor(@InjectRepository(LessonEntity) repository: EntityRepository<LessonEntity>) {
    super(repository);
  }
}
