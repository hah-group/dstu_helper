import { Type } from '@nestjs/common';
import { ScheduleProvider } from './schedule.provider';
import { DSTUScheduleProvider } from './dstu/dstu-schedule.provider';

export const ScheduleProviders: Record<string, Type<ScheduleProvider>> = {
  DSTU: DSTUScheduleProvider,
};
