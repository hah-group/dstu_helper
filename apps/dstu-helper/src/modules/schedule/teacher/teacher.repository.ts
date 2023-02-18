import { CoreRepository } from '@dstu_helper/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
