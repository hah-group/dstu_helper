import { Injectable, NestMiddleware } from '@nestjs/common';
import { VkService } from './vk.service';

@Injectable()
export class VkBotMiddleware implements NestMiddleware {
  constructor(private vkService: VkService) {}

  use(req: any, res: any, next: () => void) {
    try {
      this.vkService.bot.webhookCallback(req, res, <() => {}>next);
    } catch (e) {
      console.log(e);
    }
  }
}
