import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { DstuService } from '../dstu/dstu.service';
import { StudyGroupService } from '../study-group/study-group.service';
import * as moment from 'moment';
import { GroupWithScheduleFullType } from '../study-group/group-with-schedule-full.type';
import { GroupInfo } from '../dstu/api-response-group.dstu.type';
import { StudyGroup } from '@prisma/client';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(private sourceService: DstuService) {}

  async findGroup(groupName: string): Promise<GroupInfo | undefined> {
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
  }
}
