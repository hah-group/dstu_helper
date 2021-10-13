import { Controller, Get, Logger } from '@nestjs/common';
import { CacheProducer } from './cache.producer';

@Controller('cache')
export class CacheController {
  private readonly logger = new Logger(CacheController.name);

  constructor(private cacheProducer: CacheProducer) {}

  @Get('update')
  async updateCache(): Promise<void> {
    this.logger.warn('Manual cache update');
    await this.cacheProducer.updateSchedule();
  }
}
