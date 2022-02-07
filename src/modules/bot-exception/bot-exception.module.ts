import { Module } from '@nestjs/common';
import { BotExceptionHandler } from './bot-exception.handler';

@Module({
  providers: [BotExceptionHandler],
  exports: [BotExceptionHandler],
})
export class BotExceptionModule {}
