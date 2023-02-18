import { Controller, Get } from '@nestjs/common';

import { ScheduleCacheService } from './schedule-cache.service';

@Controller('schedule/cache')
export class ScheduleCacheController {
  constructor(private readonly scheduleCacheService: ScheduleCacheService) {}

  @Get('update')
  public async updateCache(): Promise<void> {
    await this.scheduleCacheService.updateGroupList();
    await this.scheduleCacheService.updateSchedule();
  }

  @Get('update/group')
  public async updateGroupList(): Promise<void> {
    await this.scheduleCacheService.updateGroupList();
  }

  @Get('update/schedule')
  public async updateSchedule(): Promise<void> {
    await this.scheduleCacheService.updateSchedule();
  }
}
