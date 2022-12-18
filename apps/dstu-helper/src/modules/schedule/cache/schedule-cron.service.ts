import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScheduleCacheService } from './schedule-cache.service';

@Injectable()
export class ScheduleCronService {
  constructor(private readonly scheduleCacheService: ScheduleCacheService) {}

  @Cron('0 0 4 * *')
  public async update(): Promise<void> {
    await this.scheduleCacheService.updateGroupList();
    await this.scheduleCacheService.updateSchedule();
  }
}
