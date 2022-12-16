import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { DomainEntity } from '@dstu_helper/common';
import { LessonEntity } from '../lesson/lesson.entity';

@Entity({ tableName: 'subject' })
export class SubjectEntity extends DomainEntity {
  @Property()
  public name!: string;

  @OneToMany(() => LessonEntity, 'subject')
  public lessons = new Collection<LessonEntity>(this);

  constructor(name: string) {
    super();

    this.name = name;
  }
}
