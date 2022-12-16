import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { DomainEntity } from '@dstu_helper/common';
import { LessonEntity } from '../lesson/lesson.entity';
import { AudienceInfo } from '../lesson/parser/lesson.parser';

@Entity({ tableName: 'audience' })
export class AudienceEntity extends DomainEntity {
  @Property()
  public corpus?: string;
  @Property()
  public classRoom?: string;
  @Property()
  public distance!: boolean;

  @OneToMany(() => LessonEntity, 'audience')
  public lessons = new Collection<LessonEntity>(this);

  constructor(data: AudienceInfo) {
    super();
    this.update(data);
  }

  public update(data: AudienceInfo): void {
    this.corpus = data.corpus;
    this.classRoom = data.classRoom;
    this.distance = data.distance;
  }
}
