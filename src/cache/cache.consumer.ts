import { Process, Processor } from '@nestjs/bull';
import { CacheJobNamesEnum } from './cache-job-names.enum';
import * as lodash from 'lodash';
import { Logger } from '@nestjs/common';
import { StudyGroupService } from '../study-group/study-group.service';
import { CacheService } from './cache.service';
import { Job } from 'bull';
import { CacheJobUpdateScheduleForGroupDataType } from './cache-job-update-schedule-for-group.data.type';

@Processor('cache')
export class CacheConsumer {
  private readonly logger = new Logger('CacheJobHandler');

  constructor(private readonly groupService: StudyGroupService, private readonly cacheService: CacheService) {}

  @Process(CacheJobNamesEnum.UPDATE_SCHEDULE)
  async plannedUpdateSchedule() {
    await this.groupService.setUpdatingFlag(true);
    const chunkSize = parseInt(process.env.CHUNK_SIZE);
    this.logger.log('Start schedule updating');
    const groupsChunks = lodash.chunk(await this.groupService.studyGroups(), chunkSize);
    this.logger.log(`Update ${groupsChunks.length} chunks with chunk size ${chunkSize}`);
    for (const groupChunk of groupsChunks) {
      await Promise.all(
        groupChunk.map(async (group) => {
          const schedule = await this.cacheService.receiveSchedule(group);
          await this.groupService.update(schedule);
          await this.groupService.setUpdatingFlag(false, group.groupId);
        }),
      );
    }
  }

  @Process(CacheJobNamesEnum.UPDATE_SCHEDULE_FOR_GROUP)
  async updateScheduleForGroup(job: Job<CacheJobUpdateScheduleForGroupDataType>) {
    const group = job.data.group;
    await this.groupService.setUpdatingFlag(true, group.groupId);
    this.logger.log(`Start schedule updating for group ${group.name}`);
    const schedule = await this.cacheService.receiveSchedule(group);
    await this.groupService.update(schedule);
    await this.groupService.setUpdatingFlag(false, group.groupId);
  }
}
