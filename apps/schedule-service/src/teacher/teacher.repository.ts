import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { TeacherEntity } from './teacher.entity';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { CoreRepository } from '@dstu_helper/common';

export class TeacherRepository extends CoreRepository<TeacherEntity> {
  constructor(@InjectRepository(TeacherEntity) repository: EntityRepository<TeacherEntity>, orm: MikroORM) {
    super(repository, orm);
  }

  @UseRequestContext()
  public async upsertMany(entities: TeacherEntity[]): Promise<void> {
    const entitiesToSave = entities.map((entity) => {
      const { lessons, ...result } = entity;
      return result;
    });
    await this.queryBuilder().insert(entitiesToSave).onConflict('id').merge().execute();
  }
}
