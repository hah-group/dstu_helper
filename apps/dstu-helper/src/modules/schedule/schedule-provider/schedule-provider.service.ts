import { DateTime, lodash, Moment, Time } from '@dstu_helper/common';
import { Injectable } from '@nestjs/common';
import { Dictionary } from 'lodash';

import { AudienceEntity } from '../audience/audience.entity';
import { FacultyEntity } from '../faculty/faculty.entity';
import { GroupEntity } from '../group/group.entity';
import { LessonEntity } from '../lesson/lesson.entity';
import { GetLessonId } from '../lesson/lesson-id';
import DSTULessonParser from '../lesson/parser/lesson.parser';
import { SubjectEntity } from '../subject/subject.entity';
import { TeacherEntity } from '../teacher/teacher.entity';
import { RequestProducer } from './job/request.producer';
import { ApiResponseGroupDSTU } from './type/api-response-group.dstu.type';
import { ApiResponseScheduleDSTU } from './type/api-response-schedule.dstu.type';

export interface MergeScheduleOriginParams {
  existLessons: LessonEntity[];
  existTeacherMap: Dictionary<TeacherEntity>;
  existSubjectMap: Dictionary<SubjectEntity>;
  existAudienceMap: Dictionary<AudienceEntity>;
}

export interface MergeScheduleResult {
  lessons: LessonEntity[];
  subjects: Map<string, SubjectEntity>;
  teachers: Map<number, TeacherEntity>;
  audiences: Map<string, AudienceEntity>;
}

@Injectable()
export class ScheduleProviderService {
  constructor(private readonly requestProducer: RequestProducer) {}

  public async getUpdateDate(): Promise<Date> {
    const response: ApiResponseScheduleDSTU = await this.sendRequest('GET', `Rasp`);
    return Moment(response.data.info.dateUploadingRasp).toDate();
  }

  public async mergeGroupList(existGroups: GroupEntity[], existFaculty: FacultyEntity[]): Promise<GroupEntity[]> {
    const response: ApiResponseGroupDSTU = await this.sendRequest('GET', 'raspGrouplist', {
      year: this.getStudyYear(),
    });

    const existsGroupMap = lodash.keyBy(existGroups, (record) => record.externalId);
    const existFacultyMap = lodash.keyBy(existFaculty, (record) => record.externalId);

    return response.data.map((record) => {
      const group = existsGroupMap[record.id];
      if (!group) {
        let faculty;
        if (existFacultyMap[record.facultyID]) faculty = existFacultyMap[record.facultyID];
        else faculty = FacultyEntity.Create(record.facultyID, record.facul);

        return GroupEntity.Create(record.id, record.name, faculty);
      }

      group.name = record.name;
      group.externalId = record.id;
      group.faculty.name = record.facul;
      group.faculty.externalId = record.facultyID;
      return group;
    });
  }

  public async mergeSchedule(params: MergeScheduleOriginParams, group: GroupEntity): Promise<MergeScheduleResult> {
    const response: ApiResponseScheduleDSTU = await this.sendRequest('GET', 'Rasp', {
      idGroup: group.externalId,
    });

    const existLessonsMap = lodash.keyBy(params.existLessons, (record) => record.uniqueId);

    const result: MergeScheduleResult = {
      lessons: [],
      subjects: new Map(),
      teachers: new Map(),
      audiences: new Map(),
    };

    response.data.rasp.forEach((scheduleItem) => {
      const scheduleItemId = GetLessonId({
        groupId: group.externalId,
        start: DSTULessonParser.ParseDate(scheduleItem['датаНачала']).getTime(),
        teacherId: scheduleItem['кодПреподавателя'],
        subgroup: DSTULessonParser.ParseSubgroup(scheduleItem['дисциплина']),
      });

      const existLesson = existLessonsMap[scheduleItemId];
      let lesson = existLesson;
      if (existLesson) existLesson.update(scheduleItem);
      else lesson = LessonEntity.Create(scheduleItem, group);

      result.lessons.push(lesson);

      if (params.existSubjectMap[lesson.subject.name])
        lesson.subject.id = params.existSubjectMap[lesson.subject.name].id;
      if (lesson.teacher && params.existTeacherMap[lesson.teacher.externalId])
        lesson.teacher.id = params.existTeacherMap[lesson.teacher.externalId].id;

      if (lesson.teacher) result.teachers.set(lesson.teacher.externalId, lesson.teacher);
      result.subjects.set(lesson.subject.name, lesson.subject);

      if (lesson.audience) {
        if (params.existAudienceMap[lesson.audience.uniqueId])
          lesson.audience.id = params.existAudienceMap[lesson.audience.uniqueId].id;

        result.audiences.set(lesson.audience.uniqueId, lesson.audience);
      }
    });

    return result;
  }

  private getStudyYear(): string {
    let dateString;
    if (Time.get().isAfter(Moment('08-15', 'MM-DD'))) {
      dateString = `${Time.get().format('YYYY')}-${Time.get().add(1, 'y').format('YYYY')}`;
    } else {
      dateString = `${Time.get().subtract(1, 'y').format('YYYY')}-${Time.get().format('YYYY')}`;
    }
    return dateString;
  }

  private getScheduleDate(date: DateTime): string {
    return date.format('YYYY-MM-DD');
  }

  private async sendRequest(method: 'GET' | 'POST', url: string, data?: any): Promise<any> {
    const job = await this.requestProducer.request({ url, method, data });
    return new Promise((resolve, reject) => {
      job.isFailed().then((result) => result && reject());
      job.finished().then((result) => {
        resolve(result);
      });
    });
  }
}
