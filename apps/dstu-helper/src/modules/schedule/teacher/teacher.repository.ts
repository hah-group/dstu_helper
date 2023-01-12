import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreRepository } from '@dstu_helper/common';
import { TeacherEntity } from './teacher.entity';

export class TeacherRepository extends CoreRepository<TeacherEntity> {
  constructor(@InjectRepository(TeacherEntity) repository: Repository<TeacherEntity>) {
    super(repository);
  }

  public async upsert(entities: TeacherEntity[]): Promise<void> {
    await this.repository.upsert(entities, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['externalId'],
    });
  }

  /*@UseRequestContext()
  public async upsertMany(entities: TeacherEntity[]): Promise<void> {
    const entitiesToSave = entities.map((entity) => {
      const { lessons, ...result } = entity;
      return result;
    });
    await this.queryBuilder().insert(entitiesToSave).onConflict('id').merge().execute();
  }*/
}
