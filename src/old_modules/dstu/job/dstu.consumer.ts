/*
import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { DstuJobName } from './dstu-job-name.enum';
import { ApiResponseRaspDstuType } from '../api-response-rasp.dstu.type';
import Axios, { AxiosResponse } from 'axios';
import { DstuJobRequestData } from './dstu-job-request-data.type';
import { Job } from 'bull';
import { delay } from '../../util/delay';

@Processor('dstu')
export class DstuConsumer {
  private readonly log = new Logger('DSTUQueue');

  @Process(DstuJobName.REQUEST)
  public async update(job: Job<DstuJobRequestData>): Promise<ApiResponseRaspDstuType> {
    const { data } = job;
    return this.getSchedule(data.url);
  }

  private async getSchedule(url: string): Promise<ApiResponseRaspDstuType> {
    this.log.log(`Send request ${url}`);
    let response: AxiosResponse | undefined;
    for (let i = 0; i < 5; i++) {
      try {
        response = await Axios.get(url);
        break;
      } catch (e) {
        const nextAttempt = 1000 + 1000 * i;
        this.log.warn(`Request failed, reason: ${e.name}. Next attempt after ${nextAttempt} ms (Attempt ${i + 1})`);
        await delay(nextAttempt);
      }
    }

    if (!response) {
      throw new Error('DSTU server is unavailable');
    }

    const data: ApiResponseRaspDstuType = response.data;
    this.log.log(`Response from ${url}: ${response.status} ${response.statusText}`);

    if (data.state < 0) throw new Error('Group not found');
    return data;
  }
}
*/
