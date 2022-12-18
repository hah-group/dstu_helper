import { ConversationEntity } from './conversation.entity';
import { CoreV2Repository } from '@dstu_helper/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class ConversationRepository extends CoreV2Repository<ConversationEntity> {
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
