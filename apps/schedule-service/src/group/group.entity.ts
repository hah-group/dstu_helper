import { Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, Property, Unique } from '@mikro-orm/core';
import { LessonEntity } from '../lesson/lesson.entity';
import { GroupStatus } from './group-status.enum';
import { DateTime, DomainEntity } from '@dstu_helper/common';
import { FacultyEntity } from '../faculty/faculty.entity';

@Entity({ tableName: 'group' })
export class GroupEntity extends DomainEntity {
  @Property()
  public name!: string;

  @Property()
  @Unique()
  public externalId!: number;

  @Enum({ type: () => GroupStatus, default: GroupStatus.READY })
  public status: GroupStatus = GroupStatus.READY;

  /*@OneToMany(() => UserEntity, 'group')
  public users = new Collection<UserEntity>(this);*/

  @OneToMany(() => LessonEntity, 'group')
  public lessons = new Collection<LessonEntity>(this);

  /*@OneToMany(() => ConversationEntity, 'defaultGroup')
  public conversations = new Collection<ConversationEntity>(this);*/

  @ManyToOne()
  public faculty: FacultyEntity;

  constructor(externalId: number, name: string, faculty: FacultyEntity) {
    super();
    this.externalId = externalId;
    this.name = name;
    this.faculty = faculty;
  }

  public async getLessonsAtDate(atDate: DateTime): Promise<LessonEntity[]> {
    if (!this.isInitialized()) await this.init();
    //if (!this.lessons.isInitialized()) await this.lessons.init();

    return this.lessons.matching({ filters: { atDateFilter: { date: atDate } } });
  }

  public async getLessons(): Promise<LessonEntity[]> {
    if (!this.isInitialized()) await this.init();
    return this.lessons.getItems();
  }

  public isEquals(group: GroupEntity): boolean {
    return this.id == group.id;
  }
}
