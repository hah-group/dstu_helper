import { CacheJobNamesEnum } from './cache-job-names.enum';
import { CacheJobUpdateScheduleForGroupDataType } from './cache-job-update-schedule-for-group.data.type';

export type CacheJobBaseDataType = {
  type: CacheJobNamesEnum;
};

export type CacheJobDataType = CacheJobUpdateScheduleForGroupDataType | CacheJobBaseDataType;
