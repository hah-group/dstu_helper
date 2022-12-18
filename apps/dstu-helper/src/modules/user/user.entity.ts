import { ConversationEntity } from '../conversation/conversation.entity';
import { UserProperties } from './user-properties/user-properties';
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { DomainV2Entity } from '@dstu_helper/common';

export interface UserCreateParams {
  provider: string;
  externalId: number;
  firstName?: string;
  lastName?: string;
  nickname?: string;
}

@Entity({ name: 'user' })
@Index(['externalId', 'provider'], { unique: true })
export class UserEntity extends DomainV2Entity {
  @Column()
  public firstName?: string;

  @Column()
  public lastName?: string;

  @Column()
  public nickname?: string;

  @Column()
  public provider: string;

  @Column({ type: 'bigint' })
  public externalId: number;

  @Column()
  public groupId?: number;

  @ManyToMany(() => ConversationEntity, (entity) => entity.users)
  @JoinTable()
  public conversations!: Promise<ConversationEntity[]>;

  @Column({ type: 'simple-json', nullable: true })
  public properties!: UserProperties;

  constructor(params: UserCreateParams) {
    super();
    this.provider = params.provider;
    this.externalId = params.externalId;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.nickname = params.nickname;
  }

  public async checkConversation(conversation?: ConversationEntity): Promise<boolean> {
    if (!conversation) return false;
    const conversations = await this.conversations;
    const conversationIds = conversations.map((record) => record.id);
    if (!conversationIds.includes(conversation.id)) {
      this.conversations = Promise.resolve([...conversations, conversation]);
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
