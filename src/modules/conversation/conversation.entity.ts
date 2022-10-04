import { Collection, Entity, ManyToMany, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { DomainEntity } from '../../framework/database/domain.entity';
import { UserEntity } from '../user/user.entity';
import { GroupEntity } from '../group/group.entity';

@Entity({ tableName: 'conversation' })
@Unique({ properties: ['provider', 'externalId'] })
export class ConversationEntity extends DomainEntity {
  @Property()
  public provider!: string;

  @Property()
  public externalId!: number;

  @ManyToOne()
  public defaultGroup?: GroupEntity;

  @ManyToMany(() => UserEntity, 'conversations')
  public users = new Collection<UserEntity>(this);

  public async updateGroup(group: GroupEntity): Promise<void> {
    if (!this.users.isInitialized()) await this.users.init();

    this.users.getItems().forEach((user) => {
      if (!this.defaultGroup || !user.group) return;
      if (user.group.isEquals(this.defaultGroup)) user.group = group;
    });

    this.defaultGroup = group;
  }
}
