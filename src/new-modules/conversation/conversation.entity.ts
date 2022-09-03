import { DomainEntity } from '../../framework/database/domain.entity';
import { Collection, Entity, ManyToMany } from '@mikro-orm/core';
import { UserEntity } from '../user/user.entity';

@Entity({ tableName: 'conversation' })
export class ConversationEntity extends DomainEntity {
  @ManyToMany(() => UserEntity, (user) => user.conversations)
  public users = new Collection<UserEntity>(this);
}
