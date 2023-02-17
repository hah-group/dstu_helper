import { Injectable } from '@nestjs/common';
import { BotMessage } from '../../../../framework/bot/type/bot-message.type';
import { OnButton } from '../../../../framework/bot/decorator/on-button.decorator';
import { SettingsButton } from '../../private/keyboard/main-menu.keyboard';
import { UserEntity } from '../../../user/user.entity';
import { UserRepository } from '../../../user/user.repository';
import { UserPropertyFilter } from '../../../../framework/bot/decorator/user-property.filter-decorator';
import { PrivateSetupHandler } from '../../private/private-setup.handler';
import { OnMessage } from '../../../../framework/bot/decorator/on-message.decorator';
import { SettingsStageConditionFilter } from './settings-stage-condition.filter';
import { User } from '../../../../framework/bot/decorator/user.param-decorator';
import { MenuService } from '@dstu_helper/common';

@Injectable()
export class PrivateSettingsMainHandler {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly privateSetupHandler: PrivateSetupHandler,
    private readonly menuService: MenuService,
  ) {}

  @OnButton(SettingsButton)
  public async onSettings(message: BotMessage, @User() user: UserEntity): Promise<void> {
    const result = await this.menuService.enterMenu('settings');

    user.properties.inputStage.set(result.path);
    await message.send(result.text, result.keyboard);
    await this.userRepository.save(user);
  }

  @OnMessage(undefined, 'private')
  @UserPropertyFilter('inputStage', SettingsStageConditionFilter)
  public async onMenuAction(message: BotMessage, @User() user: UserEntity): Promise<void> {
    const result = await this.menuService.handle(message, user.properties.inputStage.get());
    if (!result) return this.privateSetupHandler.toHome(message);

    user.properties.inputStage.set(result.path);
    await message.send(result.text, result.keyboard);
    await this.userRepository.save(user);
  }
}
