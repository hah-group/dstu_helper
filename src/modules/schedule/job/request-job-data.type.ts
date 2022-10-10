import { ScheduleProviderName } from '../schedule-provider-name.type';

export interface RequestJobData {
  provider: ScheduleProviderName;
  url: string;
  body?: any;
  method: 'GET' | 'POST';
}
