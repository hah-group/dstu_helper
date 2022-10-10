import { RequestJobData } from './request-job-data.type';
import { Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';

export class RequestProducer {
  private readonly log = new Logger('RequestProducer');

  constructor(@InjectQueue('schedule_request') private queue: Queue<RequestJobData>) {}

  public async request(data: RequestJobData): Promise<Job<RequestJobData>> {
    this.log.debug(`Add request in queue`);
    return this.queue.add(data);
  }
}
