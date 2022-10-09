import { DomainEntity } from '../../framework/database/domain.entity';
import { Collection, Entity, ManyToMany, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { GroupEntity } from '../group/group.entity';
import { ConversationEntity } from '../conversation/conversation.entity';
import { UserPropertiesType } from './user-properties/user-properties.type';
import { UserProperties } from './user-properties/user-properties';

export interface UserCreateParams {
  provider: string;
  externalId: number;
  firstName?: string;
  lastName?: string;
  nickname?: string;
}

@Entity({ tableName: 'user' })
@Unique({ properties: ['externalId', 'provider'] })
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

  @Property({ type: UserPropertiesType, nullable: true })
  public properties!: UserProperties;

  public readonly isNew: boolean = false;

  constructor(params: UserCreateParams) {
    super();
    this.provider = params.provider;
    this.externalId = params.externalId;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.nickname = params.nickname;
    this.isNew = true;
  }

  public async checkConversation(conversation?: ConversationEntity): Promise<boolean> {
    if (!conversation) return false;
    if (!this.conversations.isInitialized()) await this.conversations.init();
    if (!this.conversations.getIdentifiers().includes(conversation.id)) {
      this.conversations.add(conversation);
      return true;
    }

    return false;
  }

  public async checkGroup(conversation?: ConversationEntity): Promise<boolean> {
    if (!conversation || !conversation.defaultGroup) return false;
    if (this.group) return false;

    this.group = conversation.defaultGroup;
    return true;
  }
}
