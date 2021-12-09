import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { DstuJobName } from './dstu-job-name.enum';
import { ApiResponseRaspDstuType } from '../api-response-rasp.dstu.type';
import Axios from 'axios';
import { DstuJobRequestData } from './dstu-job-request-data.type';
import { Job } from 'bull';

@Processor('dstu_service')
export class DstuConsumer {
  private readonly log = new Logger('DstuConsumer');

  @Process(DstuJobName.REQUEST)
  public async update(job: Job<DstuJobRequestData>): Promise<ApiResponseRaspDstuType> {
    const { data } = job;
    return this.getSchedule(data.url);
  }

  private async getSchedule(url: string): Promise<ApiResponseRaspDstuType> {
    const response = await Axios.get(url);
    const data: ApiResponseRaspDstuType = response.data;
    this.log.log(`Send request ${url}: ${response.status} ${response.statusText}`);

    if (data.state < 0) throw new Error('Group not found');
    return data;
  }
}
