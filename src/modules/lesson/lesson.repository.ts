import { CoreRepository } from '../../framework/repository/core.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { LessonEntity } from './lesson.entity';
import { MikroORM } from '@mikro-orm/core';

export class LessonRepository extends CoreRepository<LessonEntity> {
  constructor(@InjectRepository(LessonEntity) repository: EntityRepository<LessonEntity>, orm: MikroORM) {
    super(repository, orm);
  }

  public async upsertMany(entities: LessonEntity[]): Promise<void> {
    await this.queryBuilder()
      .insert(entities)
      .onConflict(['group_id', 'start', 'subgroup', 'teacher_id'])
      .merge()
      .execute();
  }
}
