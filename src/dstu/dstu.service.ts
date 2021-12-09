import { Injectable, Logger } from '@nestjs/common';
import Axios from 'axios';
import { ApiResponseRaspDstuType, DstuRasp } from './api-response-rasp.dstu.type';
import * as moment from 'moment';
import DstuLessonParser from './dstu-lesson.parser';
import { ApiResponseGroupDstuType } from './api-response-group.dstu.type';
import { DateTime, Time } from 'src/util/time';
import { StudyGroupService } from 'src/study-group/study-group.service';
import * as lodash from 'lodash';
import { Lesson, LessonArgs } from '../lesson/lesson.entity';
import { StudyGroup } from '../study-group/study-group.entity';
import { TeacherArgs } from '../teacher/teacher.entity';
import { LessonService } from 'src/lesson/lesson.service';
import { LessonFactory } from '../lesson/lesson.factory';
import { DstuProducer } from './job/dstu.producer';
import { UpdateStatus } from '@prisma/client';

@Injectable()
export class DstuService {
  private readonly log = new Logger('DstuService');

  constructor(
    private readonly studyGroupService: StudyGroupService,
    private readonly lessonService: LessonService,
    private readonly dstuProducer: DstuProducer,
  ) {}

  public async update(): Promise<void> {
    const date = Time.get();
    const groups = await this.studyGroupService.getAll(true);
    this.log.log(`Start schedule update at ${date.toISOString()} for ${groups.length} groups`);
    groups.forEach((group) => (group.updateStatus = UpdateStatus.IN_PROGRESS));
    await this.studyGroupService.saveMany(groups);

    const chunks = lodash.chunk(groups, parseInt(process.env.CHUNK_SIZE));
    const lessons: Map<StudyGroup, Lesson[]> = new Map<StudyGroup, Lesson[]>();
    //for (const chunk of chunks) {
    const promises = groups.map(async (group) => {
      this.log.log(`Updating ${group.name} group`);
      try {
        const groupLessons = await this.getLessons(date, group);
        this.log.log(`Received ${groupLessons.length} lessons`);
        lessons.set(group, groupLessons);
      } catch (e) {
        const err = <Error>e;
        this.log.error(`Group schedule updating error: ${err.message}`);
        this.log.error(err.stack);
        group.updateStatus = UpdateStatus.FAILURE;
        this.studyGroupService.save(group);
      }
    });
    /*const results =*/ await Promise.all(promises);
    /*lessons.push(...lodash.flatten(results));*/
    //}

    //lessons = lodash.compact(lessons);
    this.log.log(`Total lessons entity ${lessons.size}`);
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
        this.log.error(err.stack);
        group.updateStatus = UpdateStatus.FAILURE;
      }
    }

    await this.studyGroupService.saveMany(groups);
  }

  public async getLessons(date: DateTime, group: StudyGroup): Promise<Lesson[]> {
    const schedule = await this.getSchedule(date, group.id);
    const nextWeekSchedule = await this.getSchedule(date, group.id, 1);

    const rawData: { isTopWeek: boolean; rasp: DstuRasp[] }[] = [];
    rawData.push({
      isTopWeek: schedule.data.info.selectedNumNed == 1,
      rasp: schedule.data.rasp,
    });
    rawData.push({
      isTopWeek: nextWeekSchedule.data.info.selectedNumNed == 1,
      rasp: nextWeekSchedule.data.rasp,
    });

    const result: {
      lesson: Omit<LessonArgs, 'teacher'>;
      teacher?: TeacherArgs;
    }[] = [];

    for (const week of rawData) {
      for (const rasp of week.rasp) {
        const subject = DstuLessonParser.subjectParse(rasp['дисциплина']);
        const destination = DstuLessonParser.classRoomParse(rasp['аудитория']);

        if (!subject || !destination) continue;

        result.push({
          lesson: {
            groupId: group.id,
            start: DstuLessonParser.dateParser(rasp['датаНачала']),
            end: DstuLessonParser.dateParser(rasp['датаОкончания']),
            isTopWeek: week.isTopWeek,
            type: subject.type,
            order: rasp['номерЗанятия'],
            name: subject.name,
            subgroup: subject.subgroup,
            subsection: subject.subsection,
            corpus: destination.corpus,
            classRoom: destination.classRoom,
            distance: destination.distance,
          },
          teacher: {
            id: rasp['кодПреподавателя'],
            ...DstuLessonParser.teacherParser(rasp['преподаватель']),
          },
        });
      }
    }

    return result.map((record) => LessonFactory.create(record.lesson, record.teacher));
  }

  public async getGroups(): Promise<ApiResponseGroupDstuType> {
    const dateString = `${moment().format('YYYY')}-${moment().add(1, 'y').format('YYYY')}`;
    const response: ApiResponseGroupDstuType = (
      await Axios.get(`https://edu.donstu.ru/api/raspGrouplist?year${dateString}`)
    ).data;
    return response;
  }

  private async getSchedule(date: DateTime, groupId: number, addWeek = 0): Promise<ApiResponseRaspDstuType> {
    const dateString = moment(date).add(addWeek, 'w').format('YYYY-MM-DD');

    const url = `https://edu.donstu.ru/api/Rasp?idGroup=${groupId}&sdate=${dateString}`;
    const job = await this.dstuProducer.request({ url });
    return job.finished();
  }
}
