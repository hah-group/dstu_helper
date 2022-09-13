import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { LessonType } from './lesson-type.enum';
import { TeacherEntity } from '../teacher/teacher.entity';
import { GroupEntity } from '../group/group.entity';
import { TimestampedEntity } from '../../framework/database/timestamped.entity';

@Entity({ tableName: 'lesson' })
export class LessonEntity extends TimestampedEntity {
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

  @PrimaryKey()
  public get id(): string {
    return [this.start.toString(), this.subgroup || -1, this.teacher?.id || -1, this.group.id].join('_');
  }
}
