import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { CacheJobDataType } from './cache-job-base.data.type';
import { Cron } from '@nestjs/schedule';
import { CacheJobNamesEnum } from './cache-job-names.enum';
import { StudyGroup } from '@prisma/client';

@Injectable()
export class CacheProducer {
  constructor(@InjectQueue('cache') private cacheQueue: Queue<CacheJobDataType>) {}

  @Cron('0 30 0 * * *')
  public async updateSchedule(): Promise<Job<CacheJobDataType>> {
    return this.cacheQueue.add(CacheJobNamesEnum.UPDATE_SCHEDULE, {
      type: CacheJobNamesEnum.UPDATE_SCHEDULE,
    });
  }

  public async updateScheduleForGroup(group: StudyGroup): Promise<Job<CacheJobDataType>> {
    return this.cacheQueue.add(CacheJobNamesEnum.UPDATE_SCHEDULE_FOR_GROUP, {
      type: CacheJobNamesEnum.UPDATE_SCHEDULE_FOR_GROUP,
      group,
    });
  }
}
