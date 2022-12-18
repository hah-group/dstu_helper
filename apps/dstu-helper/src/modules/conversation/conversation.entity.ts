import { UserEntity } from '../user/user.entity';
import { DomainV2Entity } from '@dstu_helper/common';
import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { JoinTable } from 'typeorm/browser';

@Entity({ name: 'conversation' })
@Index(['provider', 'externalId'], { unique: true })
export class ConversationEntity extends DomainV2Entity {
  @Column()
  public provider!: string;

  @Column({ type: 'bigint' })
  public externalId!: number;

  @Column()
  public defaultGroupId?: number;

  @ManyToMany(() => UserEntity, (entity) => entity.conversations, { cascade: ['update'] })
  @JoinTable()
  public users!: Promise<UserEntity[]>;

  public async updateGroup(groupId: number): Promise<void> {
    const users = await this.users;

    users.forEach((user) => {
      if (!this.defaultGroupId || !user.groupId) return;
      if (user.groupId == this.defaultGroupId) user.groupId = groupId;
    });

    this.defaultGroupId = groupId;
  }
}
