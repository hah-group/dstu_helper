import { Controller, Get, Logger } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
  private readonly logger = new Logger('Cache');

  constructor(private readonly cacheService: CacheService) {}

  @Get('update')
  async updateCache(): Promise<void> {
    this.logger.warn('Manual cache update');
    await this.cacheService.update();
  }
}
