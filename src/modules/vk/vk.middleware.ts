import { Injectable, NestMiddleware } from '@nestjs/common';
import { VkService } from './vk.service';

@Injectable()
export class VkMiddleware implements NestMiddleware {
  constructor(private vkService: VkService) {}

  use(req: any, res: any, next: () => void) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.vkService.bot.webhookCallback(req, res, next);
    } catch (e) {
      console.log(e);
    }
  }
}
