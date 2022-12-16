import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreV2Repository } from '@dstu_helper/common/repository/core-v2.repository';
import { TeacherEntity } from './teacher.entity';

export class TeacherRepository extends CoreV2Repository<TeacherEntity> {
  constructor(@InjectRepository(TeacherEntity) repository: Repository<TeacherEntity>) {
    super(repository);
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
