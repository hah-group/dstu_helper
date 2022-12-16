import { Collection, Entity, ManyToMany, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { UserEntity } from '../user/user.entity';
import { DomainEntity } from '@dstu_helper/common';

@Entity({ tableName: 'conversation' })
@Unique({ properties: ['provider', 'externalId'] })
export class ConversationEntity extends DomainEntity {
  @Property()
  public provider!: string;

  @Property({ columnType: 'bigint' })
  public externalId!: number;

  @Property()
  public defaultGroupId?: number;

  @ManyToMany(() => UserEntity, 'conversations')
  public users = new Collection<UserEntity>(this);

  public async updateGroup(groupId: number): Promise<void> {
    if (!this.users.isInitialized()) await this.users.init();

    this.users.getItems().forEach((user) => {
      if (!this.defaultGroupId || !user.groupId) return;
      if (user.groupId == this.defaultGroupId) user.groupId = groupId;
    });

    this.defaultGroupId = groupId;
  }
}
