import { forwardRef, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { DstuModule } from '../dstu/dstu.module';
import { StudyGroupModule } from '../study-group/study-group.module';
import { CacheController } from './cache.controller';
import { BullModule } from '@nestjs/bull';
import { CacheProducer } from './cache.producer';
import { CacheConsumer } from './cache.consumer';

@Module({
  providers: [CacheService, CacheProducer, CacheConsumer],
  imports: [
    BullModule.registerQueue({
      name: 'cache',
    }),
    DstuModule,
    forwardRef(() => StudyGroupModule),
  ],
  controllers: [CacheController],
  exports: [CacheService, CacheProducer],
})
export class CacheModule {}
