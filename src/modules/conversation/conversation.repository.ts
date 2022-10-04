import { CoreRepository } from '../../framework/repository/core.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ConversationEntity } from './conversation.entity';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';

export class ConversationRepository extends CoreRepository<ConversationEntity> {
  constructor(@InjectRepository(ConversationEntity) repository: EntityRepository<ConversationEntity>, orm: MikroORM) {
    super(repository, orm);
  }

  @UseRequestContext()
  public async getById(id: number, provider: string): Promise<ConversationEntity | null> {
    return this.repository.findOne({
      externalId: id,
      provider: provider,
    });
  }
}
