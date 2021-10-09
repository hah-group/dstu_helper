import {MiddlewareConsumer, Module} from '@nestjs/common';
import {BotController} from "./bot/bot.controller";
import {BotMiddleware} from "./bot.middleware";
import {BotService} from "./bot/bot.service";
import {ConfigModule} from "@nestjs/config";
import {VkIoModule} from "./vk-io/vk-io.module";

@Module({
  imports: [
      ConfigModule.forRoot(),
      VkIoModule.registerAsync({
        token: process.env.ACCESS_TOKEN,
      }),
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(BotMiddleware).forRoutes('bot');
  }
}
