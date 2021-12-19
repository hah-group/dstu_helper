import { LessonType } from '@prisma/client';
/*import * as crypto from 'crypto';
import * as moment from 'moment';*/
import { DateTime, Time } from 'src/util/time';
import { Teacher } from '../teacher/teacher.entity';
import { TimeRelativeProcessor } from '../util/time-relative.processor';

export interface LessonArgs {
  id: string;
  groupId: number;
  start: Date;
  end: Date;
  isTopWeek: boolean;
  type: LessonType;
  order: number;
  name: string;
  teacher?: Teacher;
  subgroup?: number;
  subsection?: string;
  corpus?: string;
  classRoom?: string;
  distance: boolean;
}

export class Lesson {
  public readonly id: string;
  public readonly groupId: number;
  public readonly start: Date;
  public readonly end: Date;
  public readonly isTopWeek: boolean;
  public readonly type: LessonType;
  public readonly order: number;
  public readonly name: string;
  public readonly teacher?: Teacher;
  public readonly subgroup?: number;
  public readonly subsection?: string;
  public readonly corpus?: string;
  public readonly classRoom?: string;
  public readonly distance: boolean;

  constructor(params: LessonArgs) {
    const {
      id,
      classRoom,
      corpus,
      distance,
      end,
      name,
      order,
      start,
      subgroup,
      teacher,
      type,
      isTopWeek,
      groupId,
      subsection,
    } = params;
    this.id = id;
    this.groupId = groupId;
    this.start = start;
    this.end = end;
    this.isTopWeek = isTopWeek;
    this.type = type;
    this.order = order;
    this.name = name;
    this.teacher = teacher;
    this.subgroup = subgroup;
    this.subsection = subsection;
    this.corpus = corpus;
    this.classRoom = classRoom;
    this.distance = distance;
  }

  /*public get id(): string {
    const idPayload = `/!*${this.groupId}_${this.isTopWeek ? 1 : 0}_${this.teacher.id}_${this.name}_${
      this.subgroup || -1
    }_${this.subsection || -1}_${moment(this.start).weekday()}_${this.order}*!/${moment(this.start).toISOString()}`;
    return crypto.createHash('md5').update(idPayload).digest('hex');
  }*/

  public isInDay(date: DateTime): boolean {
    return date.isBetween(this.start, this.end, 'day', '[]');
  }

  public isNow(struct: boolean): boolean {
    if (!this.isInDay(Time.get())) return false;

    return this.order === TimeRelativeProcessor.now(struct, Time.get());
  }

  public isNext(): boolean {
    if (!this.isInDay(Time.get())) return false;

    return this.order === TimeRelativeProcessor.next(Time.get());
  }
}
