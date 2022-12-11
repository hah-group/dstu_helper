import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import Axios, { AxiosResponse } from 'axios';
import { Job } from 'bull';
import { RequestJobData } from './request-job-data.type';
import { delay } from '../../../framework/util/delay';

@Processor('schedule_request')
export class RequestConsumer {
  private readonly log = new Logger('RequestQueue');

  @Process()
  public async request(job: Job<RequestJobData>): Promise<any> {
    const data = job.data;
    this.log.log(`Send request (${data.provider}) ${data.method} ${data.url}`);

    let response: AxiosResponse | undefined;
    for (let i = 0; i < 5; i++) {
      try {
        response = await Axios.request({
          method: data.method,
          data: data.body,
          url: data.url,
        });
        break;
      } catch (e) {
        if (!(e instanceof Error)) return;
        const nextAttempt = 1000 + 1000 * i;
        this.log.warn(`Request failed, reason: ${e.name}. Next attempt after ${nextAttempt} ms (Attempt ${i + 1})`);
        this.log.warn(e.stack);
        await delay(nextAttempt);
      }
    }

    if (!response) {
      throw new Error(`${data.provider} server is unavailable`);
    }

    const result = response.data;
    this.log.log(`Response from (${data.provider}) ${data.url}: ${response.status} ${response.statusText}`);

    return result;
  }
}
