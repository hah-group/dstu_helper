import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { DstuJobData } from './dstu-job-data.type';
import { DstuJobName } from './dstu-job-name.enum';
import { DstuJobRequestData } from './dstu-job-request-data.type';

@Injectable()
export class DstuProducer {
  private readonly log = new Logger('DSTUQueue');

  constructor(@InjectQueue('dstu') private queue: Queue<DstuJobData>) {}

  public async request(data: Omit<DstuJobRequestData, 'type'>): Promise<Job<DstuJobRequestData>> {
    this.log.log(`Add request in queue`);
    return this.queue.add(DstuJobName.REQUEST, {
      type: DstuJobName.REQUEST,
      ...data,
    });
  }
}
