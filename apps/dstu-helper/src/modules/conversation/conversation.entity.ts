import { UserEntity } from '../user/user.entity';
import { DomainV2Entity } from '@dstu_helper/common';
import { Column, Entity, Index, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { GroupEntity } from '../schedule/group/group.entity';

@Entity({ name: 'conversation' })
@Index(['provider', 'externalId'], { unique: true })
export class ConversationEntity extends DomainV2Entity {
  @Column()
  public provider!: string;

  @Column({ type: 'bigint' })
  public externalId!: number;

  @ManyToOne(() => GroupEntity, (entity) => entity.conversations)
  @JoinTable()
  public defaultGroup?: Promise<GroupEntity>;

  @ManyToMany(() => UserEntity, (entity) => entity.conversations, { cascade: ['update'] })
  @JoinTable()
  public users!: Promise<UserEntity[]>;

  public async updateGroup(group: GroupEntity): Promise<void> {
    const users = await this.users;

    users.forEach((user) => {
      if (!this.defaultGroup || !user.group) return;
      if (user.group == this.defaultGroup) user.group = Promise.resolve(group);
    });

    this.defaultGroup = Promise.resolve(group);
  }
}
