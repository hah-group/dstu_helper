import { Entity, Enum, Filter, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { LessonType } from './lesson-type.enum';
import { TeacherEntity } from '../teacher/teacher.entity';
import { GroupEntity } from '../group/group.entity';
import { DomainEntity } from '../../framework/database/domain.entity';
import { DateTime } from '../../framework/util/time';
import * as moment from 'moment';

@Entity({ tableName: 'lesson' })
@Unique({ properties: ['group', 'start', 'subgroup', 'teacher'] })
@Filter({
  name: 'atDateFilter',
  cond: (args: { date: DateTime }) => {
    return {
      start: {
        $gte: moment(args.date).startOf('day').toDate(),
      },
      end: {
        $lte: moment(args.date).endOf('day').toDate(),
      },
    };
  },
})
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
  public teacher!: TeacherEntity;
  @Property()
  public subgroup = -1;
  @Property()
  public subsection?: string;
  @Property()
  public corpus?: string;
  @Property()
  public classRoom?: string;
  @Property()
  public distance!: boolean;

  public getDestination(): string | undefined {
    if (this.distance) return undefined;

    if (this.classRoom && this.corpus) return `${this.corpus}-${this.classRoom}`;
    if (this.classRoom) return this.classRoom;
  }
}
