import { Injectable } from '@nestjs/common';
import { OnMenuEnter, OnValueInput } from '@dstu_helper/common';
import { BotMessage } from '../../../../framework/bot/type/bot-message.type';
import {
  MenuHandlerResponse,
} from '../../../../../../../libs/common/src/menu/decorator/accessor/type/menu-handler.type';
import { MenuTargets } from '../../../../../../../libs/common/src/menu/decorator/menu-targets.param-decorator';
import { MenuValue } from '../../../../../../../libs/common/src/menu/decorator/menu-value.param-decorator';
import { UserRepository } from '../../../user/user.repository';

@Injectable()
export class AppearanceSettingsHandler {
  constructor(private readonly userRepository: UserRepository) {}
  @OnMenuEnter('settings.appearance')
  public async onEnter(message: BotMessage): Promise<MenuHandlerResponse> {
    return {
      data: message.from.user.properties.appearance.get(),
    };
  }

  @OnMenuEnter('settings.appearance.*')
  public async onInnerEnter(message: BotMessage): Promise<MenuHandlerResponse> {
    return this.onEnter(message);
  }

  @OnValueInput('settings.appearance.*.value')
  public async onValue(
    message: BotMessage,
    @MenuTargets() targets: string[],
    @MenuValue() value: string,
  ): Promise<void> {
    const target = targets[0].replace('-', '.');
    message.from.user.properties.appearance.set(value, target);
  }
}
