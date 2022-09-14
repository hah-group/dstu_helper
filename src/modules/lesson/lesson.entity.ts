import { Entity, Enum, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { LessonType } from './lesson-type.enum';
import { TeacherEntity } from '../teacher/teacher.entity';
import { GroupEntity } from '../group/group.entity';
import { DomainEntity } from '../../framework/database/domain.entity';

@Entity({ tableName: 'lesson' })
@Unique({ properties: ['group', 'start', 'subgroup', 'teacher'] })
export class LessonEntity extends DomainEntity {
  @ManyToOne()
  public group!: GroupEntity;
  @Property()
  public start!: Date;
  @Property()
  public end!: Date;
  @Enum(() => LessonType)
  public type!: LessonType;
  @Property()
  public order!: number;
  @Property()
  public name!: string;
  @ManyToOne()
  public teacher?: TeacherEntity;
  @Property()
  public subgroup?: number;
  @Property()
  public subsection?: string;
  @Property()
  public corpus?: string;
  @Property()
  public classRoom?: string;
  @Property()
  public distance!: boolean;
}
