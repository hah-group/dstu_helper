import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { BotMessage } from '../../framework/bot/type/bot-message.type';
import { BotBaseContext } from '../bot/type/bot-context.type';

export const SceneRedisNamespace = 'scene';

export interface SceneParams {
  provider: string;
  chatId: number;
  userId?: number;
  messageId?: number;
  name?: string;
}

@Injectable()
export class SceneService {
  constructor(@InjectRedis(SceneRedisNamespace) private readonly redis: Redis) {}

  public async set(params: SceneParams, value: Record<string, any>, ttl?: number): Promise<void> {
    const key = this.getKey(params);
    await this.redis.set(key, JSON.stringify(value));
    if (ttl) await this.redis.expire(key, ttl);
  }

  public async get(params: SceneParams): Promise<Record<string, any> | undefined> {
    const key = this.getKey(params);
    const result = await this.redis.get(key);
    return result ? JSON.parse(result) : undefined;
  }

  public async remove(params: SceneParams): Promise<void> {
    await this.redis.del(this.getKey(params));
  }

  public getKey(params: SceneParams): string {
    const stringBuilder = [];
    stringBuilder.push(`PROVIDER_${params.provider}`);
    stringBuilder.push(`CHAT_${params.chatId}`);
    if (params.userId) stringBuilder.push(`USER_${params.userId}`);
    if (params.messageId) stringBuilder.push(`MESSAGE_${params.messageId}`);
    if (params.name) stringBuilder.push(`${params.name}`);
    return stringBuilder.join('__');
  }
}
