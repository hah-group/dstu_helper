import { DomainEntity } from '../../framework/database/domain.entity';
import { Cascade, Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';
import { LessonEntity } from '../lesson/lesson.entity';

@Entity({ tableName: 'teacher' })
export class TeacherEntity extends DomainEntity {
  @Property()
  public firstName?: string;

  @Property()
  public lastName?: string;

  @Property()
  public middleName?: string;

  @Property()
  public degreeRaw?: string;

  @OneToMany(() => LessonEntity, 'teacher')
  public lessons = new Collection<LessonEntity>(this);
}
