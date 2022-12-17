import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { RequestJobData } from './request-job-data.type';
import { delay } from '@dstu_helper/common';
import { REQUEST_QUEUE } from '../constants';
import { HttpService } from '@nestjs/axios';

@Processor(REQUEST_QUEUE)
export class RequestConsumer {
  constructor(private readonly httpService: HttpService) {}
  private readonly log = new Logger('RequestQueue');

  @Process()
  public async request(job: Job<RequestJobData>): Promise<any> {
    const data = job.data;
    const uri = this.httpService.axiosRef.getUri({
      baseURL: 'https://edu.donstu.ru/api/',
      url: data.url,
      method: data.method,
      params: data.data,
    });
    this.log.log(`Send request ${data.method} ${uri}`);

    let response: any;
    for (let i = 0; i < 5; i++) {
      try {
        response = await this.httpService.axiosRef.request({
          method: data.method,
          url: uri,
        });
        break;
      } catch (e) {
        if (!(e instanceof Error)) return;
        const nextAttempt = 1000 + 1000 * i;
        this.log.warn(`Request failed, reason: ${e.name}. Next attempt after ${nextAttempt} ms (Attempt ${i + 1})`);
        await delay(nextAttempt);
      }
    }

    if (!response) {
      throw new Error(`Server is unavailable`);
    }

    const result = response.data;
    this.log.log(`Response from ${uri}: ${response.status} ${response.statusText}`);

    return result;
  }
}
