import { Cascade, Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';
import { LessonEntity } from '../lesson/lesson.entity';
import { DomainEntity } from '@dstu_helper/common';
import { TeacherInfo } from '../lesson/parser/lesson.parser';

@Entity({ tableName: 'teacher' })
export class TeacherEntity extends DomainEntity {
  @Property()
  public firstName?: string;

  @Property()
  public lastName!: string;

  @Property()
  public middleName?: string;

  @Property()
  public degreeRaw?: string;

  @Property()
  @Unique()
  public externalId!: number;

  @OneToMany(() => LessonEntity, 'teacher', { cascade: [Cascade.MERGE] })
  public lessons = new Collection<LessonEntity>(this);

  constructor(data: TeacherInfo, externalId: number) {
    super();
    this.update(data, externalId);
  }

  public isEquals(entity: TeacherEntity): boolean {
    return entity.id == this.id;
  }

  public update(data: TeacherInfo, externalId: number): void {
    this.lastName = data.lastName;
    this.firstName = data.firstName;
    this.middleName = data.middleName;
    this.degreeRaw = data.degreeRaw;
    this.externalId = externalId;
  }
}
