import { CoreRepository } from '@dstu_helper/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationEntity } from './notification.entity';

export class NotificationRepository extends CoreRepository<NotificationEntity> {
  constructor(@InjectRepository(NotificationEntity) repository: Repository<NotificationEntity>) {
    super(repository);
  }

  public async upsert(entities: NotificationEntity | NotificationEntity[]): Promise<void> {
    await this.repository.upsert(entities, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['event', 'user'],
    });
  }
}
