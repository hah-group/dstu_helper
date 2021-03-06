import { Injectable, Logger } from '@nestjs/common';
import { ApiResponseRaspDstuType, DstuRasp } from './api-response-rasp.dstu.type';
import * as moment from 'moment';
import DstuLessonParser from './dstu-lesson.parser';
import { DstuApiGroupInfo } from './api-response-group.dstu.type';
import { StudyGroupService } from 'src/modules/study-group/study-group.service';
import { LessonService } from 'src/modules/lesson/lesson.service';
import { DstuProducer } from './job/dstu.producer';
import { Time } from 'src/modules/util/time';
import { UpdateStatus } from '@prisma/client';
import { StudyGroup } from '../study-group/study-group.entity';
import { Lesson, LessonArgs } from '../lesson/lesson.entity';
import { TeacherArgs } from '../teacher/teacher.entity';
import { LessonFactory } from '../lesson/lesson.factory';
import { GroupUpdateFailedException } from '../bot-exception/exception/group-update-failed.exception';

@Injectable()
export class DstuService {
  private readonly log = new Logger('DSTU');

  constructor(
    private readonly studyGroupService: StudyGroupService,
    private readonly lessonService: LessonService,
    private readonly dstuProducer: DstuProducer,
  ) {}

  public async update(): Promise<void> {
    const date = Time.get();
    const groups = await this.studyGroupService.getAll();
    this.log.log(`Start schedule update at ${date.toISOString()} for ${groups.length} groups`);
    groups.forEach((group) => (group.updateStatus = UpdateStatus.IN_PROGRESS));
    await this.studyGroupService.saveMany(groups);

    const lessons: Map<StudyGroup, Lesson[]> = new Map<StudyGroup, Lesson[]>();
    let totalCount = 0;
    const promises = groups.map(async (group) => {
      this.log.log(`Updating ${group.name} group`);
      try {
        const groupLessons = await this.getLessons(group);
        totalCount += groupLessons.length;
        this.log.log(`Received ${groupLessons.length} lessons`);
        lessons.set(group, groupLessons);
      } catch (e) {
        this.log.error(`Group schedule updating error`);
        this.log.error(e.stack);

        group.updateStatus = UpdateStatus.FAILURE;
        this.studyGroupService.save(group);
      }
    });
    await Promise.all(promises);

    this.log.log(`Total lessons entity ${totalCount}`);
    this.log.log(`Saving collected schedule in DB`);
    for (const group of groups) {
      const groupLessons = lessons.get(group);
      if (!groupLessons) continue;
      try {
        await this.lessonService.saveMany(groupLessons);
        group.updateStatus = UpdateStatus.DONE;
      } catch (e) {
        const err = <Error>e;
        this.log.error(`Group schedule saving error: ${err.message}`);
        this.log.error(e.stack);
        group.updateStatus = UpdateStatus.FAILURE;

        throw new GroupUpdateFailedException(group);
      }
    }

    await this.studyGroupService.saveMany(groups);
  }

  public async updateGroup(group: StudyGroup): Promise<void> {
    this.log.log(`Updating ${group.name} group`);
    group.updateStatus = 'IN_PROGRESS';
    await this.studyGroupService.save(group);
    try {
      const groupLessons = await this.getLessons(group);
      this.log.log(`Received ${groupLessons.length} lessons`);
      await this.lessonService.saveMany(groupLessons);
      group.updateStatus = 'DONE';
    } catch (e) {
      const err = <Error>e;
      this.log.error(`Group schedule updating error: ${err.message}`);
      this.log.error(e.stack);
      group.updateStatus = 'FAILURE';
    }

    await this.studyGroupService.save(group);
  }

  public async getLessons(group: StudyGroup): Promise<Lesson[]> {
    const schedule = await this.getSchedule(group.id);
    this.log.log(`Fetched ${schedule.data.rasp.length} lesson items`);

    const rawData: DstuRasp[] = schedule.data.rasp;
    const result: {
      lesson: Omit<LessonArgs, 'teacher' | 'id'>;
      teacher?: TeacherArgs;
    }[] = [];

    for (const rasp of rawData) {
      const subject = DstuLessonParser.subjectParse(rasp['????????????????????']);
      const destination = DstuLessonParser.classRoomParse(rasp['??????????????????']);
      const dateStart = DstuLessonParser.dateParser(rasp['????????????????????']);

      if (!subject || !subject.name || !subject.type) {
        this.log.error(`Subject parse error: ${rasp['????????????????????']}`);
        this.log.error(`Subject object:`);
        this.log.error(subject);
        this.log.warn(`Skip schedule item ${group.id}:${rasp['??????']}`);
        continue;
      }
      if (!destination) {
        this.log.error(`Destination parse error: ${rasp['??????????????????']}`);
        this.log.warn(`Skip schedule item ${group.id}:${rasp['??????']}`);
        continue;
      }

      result.push({
        lesson: {
          groupId: group.id,
          start: DstuLessonParser.dateParser(rasp['????????????????????']),
          end: DstuLessonParser.dateParser(rasp['??????????????????????????']),
          isTopWeek: moment(dateStart).weeksInYear() % 2 != 0,
          type: subject.type,
          order: rasp['????????????????????????'],
          name: subject.name,
          subgroup: subject.subgroup,
          subsection: subject.subsection,
          corpus: destination.corpus,
          classRoom: destination.classRoom,
          distance: destination.distance,
        },
        teacher: {
          id: rasp['????????????????????????????????'],
          ...DstuLessonParser.teacherParser(rasp['??????????????????????????']),
        },
      });
    }

    return result.map((record) => LessonFactory.create(record.lesson, record.teacher));
  }

  public async findGroup(query: string): Promise<DstuApiGroupInfo | undefined> {
    this.log.log(`Finding group for query: ${query}`);

    let prettyQuery = query;
    prettyQuery = query.toUpperCase();
    prettyQuery = prettyQuery.replace(/[ \-]*/gi, '');

    try {
      const groups = await this.getGroups();
      const result = groups.find((record) => {
        return prettyQuery.indexOf(record.name.toUpperCase()) == 0;
      });
      this.log.log(`Group found result: ${!!result}`);
      return result;
    } catch (e) {
      this.log.error(`Fetching groups failure: ${e.message}`);
      this.log.error(e.stack);
    }

    return;
  }

  public async getGroups(): Promise<DstuApiGroupInfo[]> {
    const dateString = `${Time.get().format('YYYY')}-${Time.get().add(1, 'y').format('YYYY')}`;
    const url = `https://edu.donstu.ru/api/raspGrouplist?year${dateString}`;

    const job = await this.dstuProducer.request({ url });
    const response = await job.finished();

    if (response.state !== 1) throw new Error('Response return error');
    return response.data;
  }

  private async getSchedule(groupId: number): Promise<ApiResponseRaspDstuType> {
    const url = `https://edu.donstu.ru/api/Rasp?idGroup=${groupId}`;
    const job = await this.dstuProducer.request({ url });
    return job.finished();
  }
}
