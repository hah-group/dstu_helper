import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { DstuModule } from '../dstu/dstu.module';
import { CacheController } from './cache.controller';

@Module({
  providers: [CacheService],
  imports: [DstuModule],
  controllers: [CacheController],
  exports: [CacheService],
})
export class CacheModule {}
