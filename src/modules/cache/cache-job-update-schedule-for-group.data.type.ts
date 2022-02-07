import { StudyGroup } from '@prisma/client';
import { CacheJobBaseDataType } from './cache-job-base.data.type';
import { CacheJobNamesEnum } from './cache-job-names.enum';

export type CacheJobUpdateScheduleForGroupDataType = CacheJobBaseDataType & {
  type: CacheJobNamesEnum.UPDATE_SCHEDULE_FOR_GROUP;
  group: StudyGroup;
};
