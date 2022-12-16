import { Entity, Enum, Filter, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { LessonType } from './lesson-type.enum';
import { TeacherEntity } from '../teacher/teacher.entity';
import { GroupEntity } from '../group/group.entity';
import * as moment from 'moment';
import { DateTime, DomainEntity } from '@dstu_helper/common';
import { SubjectEntity } from '../subject/subject.entity';
import { AudienceEntity } from '../audience/audience.entity';
import DSTULessonParser from './parser/lesson.parser';
import { GetLessonId } from './lesson-id';
import { ApiDSTUScheduleItem } from '../schedule-provider/type/api-response-schedule.dstu.type';

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
  @ManyToOne()
  public subject!: SubjectEntity;
  @ManyToOne()
  public teacher?: TeacherEntity;
  @Property()
  public subgroup = -1;
  @Property()
  public subsection?: string;
  @ManyToOne()
  public audience!: AudienceEntity;

  /*public getDestination(): string | undefined {
    if (this.distance) return undefined;

    if (this.classRoom && this.corpus) return `${this.corpus}-${this.classRoom}`;
    if (this.classRoom) return this.classRoom;
  }*/

  constructor(data: ApiDSTUScheduleItem, group: GroupEntity) {
    super();

    this.update(data);
    this.group = group;
  }

  public get uniqueId(): string {
    return GetLessonId({
      groupId: this.group.externalId,
      start: this.start.getTime(),
      subgroup: this.subgroup,
      teacherId: this.teacher?.externalId,
    });
  }

  public isEquals(entity: LessonEntity): boolean {
    const checks = [
      entity.group.isEquals(this.group),
      entity.start.getTime() == this.start.getTime(),
      entity.subgroup == this.subgroup,
      entity.teacher && this.teacher ? entity.teacher.isEquals(this.teacher) : true,
    ];
    return checks.every((check) => check);
  }

  public update(data: ApiDSTUScheduleItem): void {
    this.updateSubject(data);
    this.updateTeacher(data);
    this.updateAudience(data);

    /*lesson.group = group;
    lesson.start = DSTULessonParser.dateParser(rasp['датаНачала']);
    lesson.end = DSTULessonParser.dateParser(rasp['датаОкончания']);
    lesson.order = rasp['номерЗанятия'];
    lesson.type = subject.type;
    lesson.name = subject.name;
    lesson.subgroup = subject.subgroup || -1;
    lesson.subsection = subject.subsection;
    lesson.corpus = destination.corpus;
    lesson.classRoom = destination.classRoom;
    lesson.distance = destination.distance;*/

    this.start = DSTULessonParser.ParseDate(data['датаНачала']);
    this.end = DSTULessonParser.ParseDate(data['датаОкончания']);
    this.order = data['номерЗанятия'];
  }

  private updateSubject(data: ApiDSTUScheduleItem): void {
    const subjectInfo = DSTULessonParser.ParseSubject(data['дисциплина']);
    if (!subjectInfo) throw new Error(`Subject parse error: "${data['дисциплина']}"`);
    this.subject.name = subjectInfo.name;
    this.type = subjectInfo.type;
    this.subsection = subjectInfo.subsection || undefined;
    this.subgroup = subjectInfo.subgroup || -1;
  }

  private updateTeacher(data: ApiDSTUScheduleItem): void {
    const teacherInfo = DSTULessonParser.ParseTeacher(data['преподаватель'], data['должность']);
    if (!teacherInfo) return;

    if (!this.teacher) this.teacher = new TeacherEntity(teacherInfo, data['кодПреподавателя']);
    else this.teacher.update(teacherInfo, data['кодПреподавателя']);
  }

  private updateAudience(data: ApiDSTUScheduleItem): void {
    const audienceInfo = DSTULessonParser.ParseAudience(data['аудитория']);
    if (!this.audience) this.audience = new AudienceEntity(audienceInfo);
    else this.audience.update(audienceInfo);
  }
}
