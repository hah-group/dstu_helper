import { Controller, Post, Request, Response } from '@nestjs/common';
import { VkService } from './vk.service';
import { Request as Req, Response as Res } from 'express';

@Controller('bot')
export class VkBotController {
  constructor(private vkService: VkService) {}

  @Post('vk')
  async botEndpoint(@Request() req: Req, @Response() res: Res) {
    this.vkService.bot.webhookCallback(req, res);
  }
}
