import { Column, Entity, Index, JoinTable, ManyToOne } from 'typeorm';
import { LessonType } from './lesson-type.enum';
import { TeacherEntity } from '../teacher/teacher.entity';
import { GroupEntity } from '../group/group.entity';
import { DomainV2Entity } from '@dstu_helper/common';
import { SubjectEntity } from '../subject/subject.entity';
import { AudienceEntity } from '../audience/audience.entity';
import DSTULessonParser from './parser/lesson.parser';
import { GetLessonId } from './lesson-id';
import { ApiDSTUScheduleItem } from '../schedule-provider/type/api-response-schedule.dstu.type';

@Entity({ name: 'lesson' })
@Index(['group', 'start', 'subgroup', 'teacher'], { unique: true })
/*@Filter({
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
})*/
export class LessonEntity extends DomainV2Entity {
  @ManyToOne(() => GroupEntity, (entity) => entity.lessons, {
    eager: true,
    nullable: false,
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  public group!: GroupEntity;

  @Column('timestamp with time zone')
  public start!: Date;

  @Column('timestamp with time zone')
  public end!: Date;

  @Column({ type: 'varchar', length: 32 })
  public type!: LessonType;

  @Column()
  public order!: number;

  @ManyToOne(() => SubjectEntity, (entity) => entity.lessons, { eager: true, cascade: ['update'], nullable: false })
  @JoinTable()
  public subject!: SubjectEntity;

  @ManyToOne(() => TeacherEntity, (entity) => entity.lessons, { nullable: true, eager: true, cascade: ['update'] })
  @JoinTable()
  public teacher?: TeacherEntity;

  @Column('int')
  public subgroup = -1;

  @Column({ nullable: true })
  public subsection?: string;

  @ManyToOne(() => AudienceEntity, (entity) => entity.lessons, { eager: true, nullable: false, cascade: ['update'] })
  @JoinTable()
  public audience!: AudienceEntity;

  /*public getDestination(): string | undefined {
    if (this.distance) return undefined;

    if (this.classRoom && this.corpus) return `${this.corpus}-${this.classRoom}`;
    if (this.classRoom) return this.classRoom;
  }*/

  public static Create(data: ApiDSTUScheduleItem, group: GroupEntity): LessonEntity {
    const entity = new this();
    entity.update(data);
    entity.group = group;
    return entity;
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

    this.start = DSTULessonParser.ParseDate(data['датаНачала']);
    this.end = DSTULessonParser.ParseDate(data['датаОкончания']);
    this.order = data['номерЗанятия'];
  }

  private updateSubject(data: ApiDSTUScheduleItem): void {
    const subjectInfo = DSTULessonParser.ParseSubject(data['дисциплина']);
    if (!subjectInfo) throw new Error(`Subject parse error: "${data['дисциплина']}"`);

    if (!this.subject) this.subject = SubjectEntity.Create(subjectInfo.name);
    else this.subject.name = subjectInfo.name;

    this.type = subjectInfo.type;
    this.subsection = subjectInfo.subsection || undefined;
    this.subgroup = subjectInfo.subgroup || -1;
  }

  private updateTeacher(data: ApiDSTUScheduleItem): void {
    const teacherInfo = DSTULessonParser.ParseTeacher(data['преподаватель'], data['должность']);
    if (!teacherInfo) return;

    if (!this.teacher) this.teacher = TeacherEntity.Create(teacherInfo, data['кодПреподавателя']);
    else this.teacher.update(teacherInfo, data['кодПреподавателя']);
  }

  private updateAudience(data: ApiDSTUScheduleItem): void {
    const audienceInfo = DSTULessonParser.ParseAudience(data['аудитория']);
    if (!this.audience) this.audience = AudienceEntity.Create(audienceInfo);
    else this.audience.update(audienceInfo);
  }
}
