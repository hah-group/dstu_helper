import { Injectable } from '@nestjs/common';
import { GroupWithScheduleFullType } from '../study-group/group-with-schedule-full.type';
import Axios from 'axios';
import { ApiResponseRaspDstuType } from './api-response-rasp.dstu.type';
import { Schedule } from '@prisma/client';
import * as moment from 'moment';
import DstuLessonParser from './dstu-lesson.parser';
import { ApiResponseGroupDstuType } from './api-response-group.dstu.type';

@Injectable()
export class DstuService {
  public async get(date: Date, groupId: number): Promise<GroupWithScheduleFullType> {
    const rasp = await this.sendRequest(date, groupId);
    const schedule: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>[] = [];

    for (const lesson of rasp.data.rasp) {
      const subject = DstuLessonParser.subjectParse(lesson['дисциплина']);
      const destination = DstuLessonParser.classRoomParse(lesson['аудитория']);
      if (!subject || !destination) continue;

      schedule.push({
        start: DstuLessonParser.dateParser(lesson['датаНачала']),
        end: DstuLessonParser.dateParser(lesson['датаОкончания']),
        lessonType: subject.type,
        lessonNumber: lesson['номерЗанятия'],
        subjectName: subject.name,
        tutorName: lesson['преподаватель'],
        subgroup: subject.subgroup,
        corpus: destination.corpus,
        classRoom: destination.classRoom,
        distance: destination.distance,
      });
    }

    return {
      groupId: rasp.data.info.group.groupID,
      name: rasp.data.info.group.name,
      updating: false,
      Schedule: schedule,
    };
  }

  public async getGroups(): Promise<ApiResponseGroupDstuType> {
    const dateString = `${moment().format('YYYY')}-${moment().add(1, 'y').format('YYYY')}`;
    const response: ApiResponseGroupDstuType = (
      await Axios.get(`https://edu.donstu.ru/api/raspGrouplist?year${dateString}`)
    ).data;
    return response;
  }

  private async sendRequest(date: Date, groupId: number): Promise<ApiResponseRaspDstuType> {
    const dateString = moment(date).format('YYYY-MM-DD');
    const response: ApiResponseRaspDstuType = (
      await Axios.get(`https://edu.donstu.ru/api/Rasp?idGroup=${groupId}&sdate=${dateString}`)
    ).data;

    if (response.state < 0) throw new Error('Group not found');

    return response;
  }
}
