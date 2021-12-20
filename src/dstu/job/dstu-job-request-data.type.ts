import { DstuJobName } from './dstu-job-name.enum';
import { JobData } from '../../util/job-data.type';

export interface DstuJobRequestData extends JobData {
  type: DstuJobName.REQUEST;
  url: string;
}
