import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { DstuService } from '../dstu/dstu.service';
import * as moment from 'moment';

import { Cron } from '@nestjs/schedule';

@Injectable()
export class CacheService {
  private readonly log = new Logger('CacheService');

  constructor(private sourceService: DstuService) {}

  @Cron('0 30 0 * * *')
  public async update(): Promise<void> {
    this.log.log('Running a schedule update');
    const startTime = moment();
    await this.sourceService.update();
    this.log.log(`Schedule update is ended in ${moment().diff(startTime, 's', true)} seconds`);
  }

  /*async findGroup(groupName: string): Promise<GroupInfo | undefined> {
    this.logger.log(`Find group ${groupName}`);
    const groups = await this.sourceService.getGroups();
    const result = groups.data.find((groupInfo) => groupInfo.name.match(`${groupName}`));
    this.logger.log(`Group ${groupName} ${result ? 'found' : 'not found'}`);
    return result;
  }

  public async receiveSchedule(group: StudyGroup): Promise<GroupWithScheduleFullType> {
    const currentDate = moment().startOf('week');
    const nextDate = moment().startOf('week').add(1, 'w');
    const schedule = await this.sourceService.get(currentDate.toDate(), group.groupId);
    const scheduleNextWeek = await this.sourceService.get(nextDate.toDate(), group.groupId);
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
