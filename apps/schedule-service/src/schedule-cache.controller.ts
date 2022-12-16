import { Controller, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ScheduleCacheService } from './cache/schedule-cache.service';
import { delay } from '@dstu_helper/common';

@Controller()
export class ScheduleCacheController implements OnApplicationBootstrap {
  constructor(private readonly scheduleCacheService: ScheduleCacheService) {}

  @MessagePattern('cache.manual_update.groups')
  public async manualUpdateGroups(): Promise<void> {
    await this.scheduleCacheService.updateGroupList();
  }

  @MessagePattern('cache.manual_update.schedule')
  public async manualUpdateSchedule(): Promise<void> {
    await this.scheduleCacheService.updateSchedule();
  }

  public async onApplicationBootstrap(): Promise<void> {
    await delay(5000);
    await this.scheduleCacheService.updateGroupList();
  }
}
