import { Controller, Post, Request, Response } from '@nestjs/common';
import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private botService: BotService) {}

  @Post()
  async botEndpoint(@Request() req, @Response() res) {
    this.botService.bot.webhookCallback(req, res, null);
  }
}
