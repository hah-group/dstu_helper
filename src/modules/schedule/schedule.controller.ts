import { Controller, Get, Param } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Cron } from '@nestjs/schedule';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('update/:provider?/:groupId?')
  public async updateSchedule(@Param('provider') provider?: string, @Param('groupId') groupId?: string): Promise<void> {
    await this.scheduleService.updateSchedule(provider, groupId ? parseInt(groupId) : undefined);
  }

  @Cron('0 4 23 * * *')
  public async cache(): Promise<void> {
    await this.scheduleService.updateSchedule();
  }
}
