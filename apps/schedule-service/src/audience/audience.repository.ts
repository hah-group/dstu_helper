import { InjectRepository } from '@nestjs/typeorm';
import { AudienceEntity } from './audience.entity';
import { Repository } from 'typeorm';
import { CoreV2Repository } from '@dstu_helper/common/repository/core-v2.repository';

export class AudienceRepository extends CoreV2Repository<AudienceEntity> {
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
