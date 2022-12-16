import { DateTime, lodash, Moment, Time } from '@dstu_helper/common';
import { Injectable } from '@nestjs/common';
import { RequestProducer } from './job/request.producer';
import { GroupEntity } from '../group/group.entity';
import { GroupRepository } from '../group/group.repository';
import { FacultyEntity } from '../faculty/faculty.entity';
import { LessonEntity } from '../lesson/lesson.entity';
import { GetLessonId } from '../lesson/lesson-id';
import DSTULessonParser from '../lesson/parser/lesson.parser';
import { ApiResponseScheduleDSTU } from './type/api-response-schedule.dstu.type';
import { ApiResponseGroupDSTU } from './type/api-response-group.dstu.type';

export interface ProviderGroup {
  id: number;
  name: string;
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

  public async getSchedule(
    existLessons: LessonEntity[],
    group: GroupEntity,
    startDate: DateTime,
  ): Promise<LessonEntity[]> {
    const response: ApiResponseScheduleDSTU = await this.sendRequest('GET', 'Rasp', {
      idGroup: group.externalId,
      sdate: this.getScheduleDate(startDate),
    });

    const existLessonsMap = lodash.keyBy(existLessons, (record) => record.uniqueId);
    return response.data.rasp.map((scheduleItem) => {
      const scheduleItemId = GetLessonId({
        groupId: group.externalId,
        start: DSTULessonParser.ParseDate(scheduleItem['датаНачала']).getTime(),
        teacherId: scheduleItem['кодПреподавателя'],
        subgroup: DSTULessonParser.ParseSubgroup(scheduleItem['дисциплина']),
      });

      const existLesson = existLessonsMap[scheduleItemId];
      if (existLesson) {
        existLesson.update(scheduleItem);
        return existLesson;
      } else {
        return LessonEntity.Create(scheduleItem, group);
      }
    });
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
