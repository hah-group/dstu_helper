import { DomainEntity } from '../../framework/database/domain.entity';
import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { SocialSource } from '../../framework/bot/type/social.enum';
import { GroupEntity } from '../group/group.entity';
import { ConversationEntity } from '../conversation/conversation.entity';

@Entity({ tableName: 'User' })
export class UserEntity extends DomainEntity {
  @Property()
  public firstName?: string;

  @Property()
  public lastName?: string;

  @Property()
  public social: SocialSource;

  @Property()
  public locale: string;

  @ManyToOne()
  public group: GroupEntity;

  @ManyToMany()
  public conversations = new Collection<ConversationEntity>(this);
}
