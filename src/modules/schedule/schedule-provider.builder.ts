import { Injectable } from '@nestjs/common';
import { RequestProducer } from './job/request.producer';
import { ScheduleProviderName } from './schedule-provider-name.type';
import { ScheduleProvider } from './schedule.provider';
import { ScheduleProviders } from './schedule-providers';

@Injectable()
export class ScheduleProviderBuilder {
  constructor(private readonly requestProducer: RequestProducer) {}

  public build(name: ScheduleProviderName): ScheduleProvider {
    const provider = ScheduleProviders[name];
    return new provider(this.requestProducer, name);
  }

  public buildAll(): ScheduleProvider[] {
    return Object.entries(ScheduleProviders).map(([key, value]) => {
      return new value(this.requestProducer, key);
    });
  }
}
