import { DomainEntity } from '@dstu_helper/common';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { PropertiesTransformer } from '../../../../../libs/common/src/properties';
import { ConversationEntity } from '../conversation/conversation.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { GroupEntity } from '../schedule/group/group.entity';
import { UserProperties } from './user-properties/user-properties';

export interface UserCreateParams {
  provider: string;
  externalId: number;
  firstName?: string;
  lastName?: string;
  nickname?: string;
}

@Entity({ name: 'user' })
@Index(['externalId', 'provider'], { unique: true })
export class UserEntity extends DomainEntity {
  @Column()
  public firstName?: string;

  @Column()
  public lastName?: string;

  @Column()
  public nickname?: string;

  @Column()
  public provider!: string;

  @Column({ type: 'bigint' })
  public externalId!: number;

  @ManyToOne(() => GroupEntity, (entity) => entity.users)
  @JoinTable()
  public group?: Promise<GroupEntity>;

  @ManyToMany(() => ConversationEntity, (entity) => entity.users)
  @JoinTable()
  public conversations!: Promise<ConversationEntity[]>;

  @OneToMany(() => NotificationEntity, (entity) => entity.user)
  @JoinTable()
  public notifications!: Promise<NotificationEntity[]>;

  @Column({
    type: 'simple-json',
    nullable: true,
    transformer: new PropertiesTransformer(UserProperties),
  })
  public properties!: UserProperties;

  public static Create(data: UserCreateParams): UserEntity {
    const entity = new this();
    entity.update(data);
    return entity;
  }

  public update(data: UserCreateParams): void {
    this.provider = data.provider;
    this.externalId = data.externalId;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.nickname = data.nickname;
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
    if (!conversation || !conversation.defaultGroup) return false;
    if (!this.group) return false;

    this.group = conversation.defaultGroup;
    return true;
  }
}
