import { CoreRepository } from '@dstu_helper/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConversationEntity } from './conversation.entity';

export class ConversationRepository extends CoreRepository<ConversationEntity> {
  constructor(@InjectRepository(ConversationEntity) repository: Repository<ConversationEntity>) {
    super(repository);
  }

  public async getById(id: number, provider: string): Promise<ConversationEntity | null> {
    return this.repository.findOne({
      where: {
        externalId: id,
        provider: provider,
      },
    });
  }
}
