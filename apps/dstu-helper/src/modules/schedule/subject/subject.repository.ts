import { CoreRepository } from '@dstu_helper/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectEntity } from './subject.entity';

export class SubjectRepository extends CoreRepository<SubjectEntity> {
  constructor(@InjectRepository(SubjectEntity) repository: Repository<SubjectEntity>) {
    super(repository);
  }

  public async upsert(entities: SubjectEntity[]): Promise<void> {
    await this.repository.upsert(entities, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['name'],
    });
  }
}
