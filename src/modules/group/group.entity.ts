import { DomainEntity } from '../../framework/database/domain.entity';
import { Collection, Entity, Enum, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/core';
import { UserEntity } from '../user/user.entity';
import { UniversityEntity } from '../university/university.entity';
import { LessonEntity } from '../lesson/lesson.entity';
import { ConversationEntity } from '../conversation/conversation.entity';
import { DateTime } from '../../framework/util/time';
import { GroupStatus } from './group-status.enum';

@Entity({ tableName: 'group' })
@Unique({ properties: ['externalId', 'university'] })
export class GroupEntity extends DomainEntity {
  @Property()
  public lastUpdateAt?: Date;

  @Property()
  public name!: string;

  @Property()
  public externalId!: number;

  @Enum({ type: () => GroupStatus, default: GroupStatus.READY })
  public status: GroupStatus = GroupStatus.READY;

  @ManyToOne()
  public university!: UniversityEntity;

  @OneToMany(() => UserEntity, 'group')
  public users = new Collection<UserEntity>(this);

  @OneToMany(() => LessonEntity, 'group')
  public lessons = new Collection<LessonEntity>(this);

  @OneToMany(() => ConversationEntity, 'defaultGroup')
  public conversations = new Collection<ConversationEntity>(this);

  public async getLessonsAtDate(atDate: DateTime): Promise<LessonEntity[]> {
    if (!this.isInitialized()) await this.init();
    //if (!this.lessons.isInitialized()) await this.lessons.init();

    return this.lessons.matching({ filters: { atDateFilter: { date: atDate } } });
  }

  public isEquals(group: GroupEntity): boolean {
    return this.id == group.id;
  }
}
