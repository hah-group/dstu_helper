import { JobData } from '../../util/job-data.type';
import { DstuJobName } from './dstu-job-name.enum';

export interface DstuJobRequestData extends JobData {
  type: DstuJobName.REQUEST;
  url: string;
}
