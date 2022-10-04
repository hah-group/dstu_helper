import { Moment } from 'moment';
import { GroupEntity } from 'src/modules/group/group.entity';
import { LessonEntity } from '../lesson/lesson.entity';
import { RequestProducer } from './job/request.producer';
import { TeacherEntity } from '../teacher/teacher.entity';

export interface ProviderSchedule {
  lessons: LessonEntity[];
  teachers: TeacherEntity[];
  lastUpdatedAt: Moment;
  withErrors: boolean;
}

export interface ProviderGroup {
  id: number;
  name: string;
}

export abstract class ScheduleProvider {
  protected constructor(protected readonly producer: RequestProducer, public readonly name: string) {}

  public abstract getSchedule(group: GroupEntity): Promise<ProviderSchedule | null>;
  public abstract findGroup(query: string): Promise<ProviderGroup | null>;
  public abstract bumpGroupCourse(group: GroupEntity): Promise<GroupEntity>;
}
