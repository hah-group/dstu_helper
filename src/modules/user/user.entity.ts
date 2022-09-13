import { DomainEntity } from '../../framework/database/domain.entity';
import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { GroupEntity } from '../group/group.entity';
import { ConversationEntity } from '../conversation/conversation.entity';

export interface UserCreateParams {
  provider: string;
  externalId: number;
  firstName?: string;
  lastName?: string;
  nickname?: string;
}

@Entity({ tableName: 'user' })
export class UserEntity extends DomainEntity {
  @Property()
  public firstName?: string;

  @Property()
  public lastName?: string;

  @Property()
  public nickname?: string;

  @Property()
  public provider: string;

  @Property()
  public externalId: number;

  @ManyToOne()
  public group?: GroupEntity;

  @ManyToMany()
  public conversations = new Collection<ConversationEntity>(this);

  constructor(params: UserCreateParams) {
    super();
    this.provider = params.provider;
    this.externalId = params.externalId;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.nickname = params.nickname;
  }
}
