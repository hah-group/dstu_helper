import { RequestJobData } from './request-job-data.type';
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { REQUEST_QUEUE } from '../constants';

@Injectable()
export class RequestProducer {
  private readonly log = new Logger('RequestProducer');

  constructor(@InjectQueue(REQUEST_QUEUE) private queue: Queue<RequestJobData>) {}

  public async request(data: RequestJobData): Promise<Job<RequestJobData>> {
    return this.queue.add(data);
  }
}
