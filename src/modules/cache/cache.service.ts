import { Injectable, Logger } from '@nestjs/common';
import { BumpedGroupsResult, DstuService } from '../dstu/dstu.service';
import * as moment from 'moment';

import { Cron } from '@nestjs/schedule';
import { StudyGroup } from '../study-group/study-group.entity';
import { LessonService } from '../lesson/lesson.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InternalEvent } from '../util/internal-event.enum';
import { StudyGroupService } from '../study-group/study-group.service';

@Injectable()
export class CacheService {
  private readonly log = new Logger('CacheService');

  constructor(
    private dstuService: DstuService,
    private readonly lessonService: LessonService,
    private readonly eventEmitter: EventEmitter2,
    private readonly studyGroupService: StudyGroupService,
  ) {}

  @Cron('0 30 0 * * *')
  public async update(): Promise<void> {
    this.log.log('Running a schedule update');
    const startTime = moment();
    await this.dstuService.update();
    this.log.log(`Schedule update is ended in ${moment().diff(startTime, 's', true)} seconds`);
  }

  public async updateGroup(group: StudyGroup): Promise<void> {
    this.log.log('Running a group schedule update');
    const startTime = moment();
    await this.dstuService.updateGroup(group);
    this.log.log(`Schedule update is ended in ${moment().diff(startTime, 's', true)} seconds`);
  }

  public async bumpGroupCourse(): Promise<BumpedGroupsResult[]> {
    this.log.log('Delete all lessons');
    const lessonBatch = await this.lessonService.deleteAll();
    this.log.log(`Deleted ${lessonBatch.count} lessons`);

    this.log.log('Try bump group course');
    const startTime = moment();
    const groups = await this.dstuService.bumpGroups();
    this.log.log(`Group bump course is ended in ${moment().diff(startTime, 's', true)} seconds`);

    this.log.log('Delete unused groups');
    const groupBatch = await this.studyGroupService.clearUnused();
    this.log.log(`Deleted ${groupBatch.count} groups`);

    await this.update();
    this.eventEmitter.emit(InternalEvent.BROADCAST_BUMP_GROUP_COURSE_NOTIFICATION, groups);
    return groups;
  }

  /*async findGroup(groupName: string): Promise<DstuApiGroupInfo | undefined> {
    this.logger.log(`Find group ${groupName}`);
    const groups = await this.dstuService.getGroups();
    const result = groups.data.find((groupInfo) => groupInfo.name.match(`${groupName}`));
    this.logger.log(`Group ${groupName} ${result ? 'found' : 'not found'}`);
    return result;
  }

  public async receiveSchedule(group: StudyGroup): Promise<GroupWithScheduleFullType> {
    const currentDate = moment().startOf('week');
    const nextDate = moment().startOf('week').add(1, 'w');
    const schedule = await this.dstuService.get(currentDate.toDate(), group.groupId);
    const scheduleNextWeek = await this.dstuService.get(nextDate.toDate(), group.groupId);
    const resultSchedule: GroupWithScheduleFullType = {
      ...schedule,
      Schedule: schedule.Schedule.concat(scheduleNextWeek.Schedule),
    };
    this.logger.log(
      `Schedule collected for the group ${group.name}. Received ${resultSchedule.Schedule.length} elements`,
    );
    return resultSchedule;
  }*/
}
