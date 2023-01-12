import { InjectRepository } from '@nestjs/typeorm';
import { AudienceEntity } from './audience.entity';
import { Repository } from 'typeorm';
import { CoreRepository } from '@dstu_helper/common';

export class AudienceRepository extends CoreRepository<AudienceEntity> {
  constructor(@InjectRepository(AudienceEntity) repository: Repository<AudienceEntity>) {
    super(repository);
  }

  public async upsert(entities: AudienceEntity[]): Promise<void> {
    await this.repository.upsert(entities, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['corpus', 'classRoom', 'distance'],
    });
  }
}
