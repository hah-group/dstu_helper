import { Injectable, NestMiddleware } from '@nestjs/common';
import { BotService } from './bot/bot.service';

@Injectable()
export class BotMiddleware implements NestMiddleware {
  constructor(private botService: BotService) {}

  use(req: any, res: any, next: () => void) {
    try {
      this.botService.bot.webhookCallback(req, res, () => {});
    } catch (e) {
      console.log(e);
    }
  }
}
