import { ProviderGroup, ProviderSchedule, ScheduleProvider } from '../schedule.provider';
import { RequestProducer } from '../job/request.producer';
import { GroupEntity } from '../../group/group.entity';
import { LessonEntity } from '../../lesson/lesson.entity';
import { ApiResponseRaspDstuType, DstuRasp } from './api-response-rasp.dstu.type';
import * as moment from 'moment';
import { Logger } from '@nestjs/common';
import DSTULessonParser from './dstu-lesson.parser';
import { TeacherEntity } from '../../teacher/teacher.entity';
import { Time } from '../../../framework/util/time';
import { DstuApiGroupInfo } from './api-response-group.dstu.type';
import * as lodash from 'lodash';

export class DSTUScheduleProvider extends ScheduleProvider {
  private readonly log = new Logger('DSTUScheduleProvider');

  constructor(producer: RequestProducer, name: string) {
    super(producer, name);
  }

  public async getSchedule(group: GroupEntity): Promise<ProviderSchedule | null> {
    const response: ApiResponseRaspDstuType = await this.sendRequest(
      'GET',
      `https://edu.donstu.ru/api/Rasp?idGroup=${group.externalId}`,
    );
    if (response.state < 0) throw new Error('DSTU Server return failed status');

    this.log.log(`Fetched ${response.data.rasp.length} lesson items`);

    const result: ProviderSchedule = {
      lessons: [],
      teachers: [],
      lastUpdatedAt: moment(response.data.info.dateUploadingRasp),
      withErrors: false,
    };

    if (group.lastUpdateAt && moment(group.lastUpdateAt).isSameOrAfter(result.lastUpdatedAt, 'day')) return null;

    const rawData: DstuRasp[] = response.data.rasp;
    const teachers: Map<number, TeacherEntity> = new Map<number, TeacherEntity>();
    for (const rasp of rawData) {
      const subject = DSTULessonParser.subjectParse(rasp['дисциплина']);
      const destination = DSTULessonParser.classRoomParse(rasp['аудитория']);
      const teacherData = DSTULessonParser.teacherParser(rasp['преподаватель']);

      if (!subject || !subject.name || !subject.type) {
        this.log.error(`Subject parse error: ${rasp['дисциплина']}`);
        this.log.error(`Subject object:`);
        this.log.error(subject);
        this.log.warn(`Skip schedule item ${group.externalId}:${rasp['код']}`);
        result.withErrors = true;
        continue;
      }
      if (!destination) {
        this.log.error(`Destination parse error: ${rasp['аудитория']}`);
        this.log.warn(`Skip schedule item ${group.externalId}:${rasp['код']}`);
        result.withErrors = true;
        continue;
      }

      const lesson = new LessonEntity();
      lesson.group = group;
      lesson.start = DSTULessonParser.dateParser(rasp['датаНачала']);
      lesson.end = DSTULessonParser.dateParser(rasp['датаОкончания']);
      lesson.order = rasp['номерЗанятия'];
      lesson.type = subject.type;
      lesson.name = subject.name;
      lesson.subgroup = subject.subgroup || -1;
      lesson.subsection = subject.subsection;
      lesson.corpus = destination.corpus;
      lesson.classRoom = destination.classRoom;
      lesson.distance = destination.distance;

      const teacherId = rasp['кодПреподавателя'];
      let teacher = teachers.get(teacherId);
      if (!teacher && teacherData) {
        teacher = new TeacherEntity();
        teacher.id = rasp['кодПреподавателя'];
        teacher.firstName = teacherData.firstName;
        teacher.lastName = teacherData.lastName;
        teacher.middleName = teacherData.middleName;
        teacher.degreeRaw = teacherData.degreeRaw;
        teachers.set(teacher.id, teacher);
        result.teachers.push(teacher);
      } else if (!teacherData) {
        teacher = new TeacherEntity();
        teacher.id = -1;
        teacher.firstName = 'Преподаватель';
        teacher.lastName = 'Неизвестный';
        teachers.set(teacher.id, teacher);
        result.teachers.push(teacher);
      }

      lesson.teacher = <TeacherEntity>teacher;

      result.lessons.push(lesson);
    }
    return result;
  }

  public async findGroup(query: string): Promise<ProviderGroup | null> {
    this.log.log(`Finding group for query: ${query}`);

    let prettyQuery = query;
    prettyQuery = query.toUpperCase();
    prettyQuery = prettyQuery.replace(/[ \-]*/gi, '');

    const groups = await this.getGroups();
    const result = groups.find((record) => {
      return prettyQuery.indexOf(record.name.toUpperCase()) == 0;
    });
    this.log.log(`Group found result: ${!!result}`);

    return result || null;
  }

  public async bumpGroupCourse(group: GroupEntity): Promise<GroupEntity> {
    const groupsInfo = await this.getGroups();
    const groupsInfoMap = lodash.keyBy(groupsInfo, (groupInfo) => groupInfo.name);

    const match = group.name.match(/[а-яa-z]+(\d)\d/i);
    if (!match || !lodash.isNumber(parseInt(match[1])))
      throw new Error(`Unable to bump group course, course not found (${group.name})`);

    const course = parseInt(match[1]) + 1;
    const newGroupName = group.name.replace(/([а-я]+)\d(\d)/i, `$1${course}$2`);
    const info = groupsInfoMap[newGroupName];

    this.log.log(`Group transition success (${group.name}|${group.externalId} -> ${info.name}|${info.id})`);
    group.name = info.name;
    group.externalId = info.id;

    return group;
  }

  private async getGroups(): Promise<DstuApiGroupInfo[]> {
    let dateString;
    if (Time.get().isAfter(moment('08-15', 'MM-DD'))) {
      dateString = `${Time.get().format('YYYY')}-${Time.get().add(1, 'y').format('YYYY')}`;
    } else {
      dateString = `${Time.get().subtract(1, 'y').format('YYYY')}-${Time.get().format('YYYY')}`;
    }

    const response = await this.sendRequest(
      'GET',
      `https://edu.donstu.ru/api/raspGrouplist?year${dateString}&t=${Date.now()}`,
    );

    if (response.state !== 1) throw new Error('Response return error');
    return response.data;
  }

  private async sendRequest(method: 'GET' | 'POST', url: string): Promise<any> {
    const job = await this.producer.request({ url, method, provider: 'DSTU' });
    return new Promise((resolve, reject) => {
      job.isFailed().then((result) => result && reject());
      job.finished().then((result) => {
        resolve(result);
      });
    });
  }
}
