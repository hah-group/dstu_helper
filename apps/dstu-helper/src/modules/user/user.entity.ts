import { Collection, Entity, ManyToMany, Property, Unique } from '@mikro-orm/core';
import { ConversationEntity } from '../conversation/conversation.entity';
import { UserPropertiesType } from './user-properties/user-properties.type';
import { UserProperties } from './user-properties/user-properties';
import { DomainEntity } from '@dstu_helper/common';

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

  @Property({ columnType: 'bigint' })
  public externalId: number;

  @Property()
  public groupId?: number;

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
    if (!conversation || !conversation.defaultGroupId) return false;
    if (this.groupId) return false;

    this.groupId = conversation.defaultGroupId;
    return true;
  }
}
