import { Module } from '@nestjs/common';
import { SceneRedisNamespace, SceneService } from './scene.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
        namespace: SceneRedisNamespace,
      },
    }),
  ],
  providers: [SceneService],
  exports: [SceneService],
})
export class SceneModule {}
