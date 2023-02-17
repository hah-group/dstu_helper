import { MenuItemDeclaration } from './type/menu-item';
import { lodash } from '@dstu_helper/common';
import { Inject, Injectable } from '@nestjs/common';
import { MENU_OPTIONS } from './constains';
import { MenuModuleOptions } from './menu-module.options';
import { BotMessage } from '../../../../apps/dstu-helper/src/framework/bot/type/bot-message.type';
import { KeyboardBuilder } from 'apps/dstu-helper/src/framework/bot/keyboard/keyboard.builder';
import { MessageMatchChecker } from '../../../../apps/dstu-helper/src/framework/bot/checker/message-match.checker';
import { BackMenuButton } from './keyboard/back-menu.button';
import { MenuHandlerService } from './decorator/accessor/menu-handler.service';
import { StringPath } from './util/string-path';
import { Text } from '../../../../apps/dstu-helper/src/framework/text/text';
import { ValueMenu } from './type/value.menu';
import { TextButton } from '../../../../apps/dstu-helper/src/framework/bot/keyboard/text.button';

export interface MenuResult {
  path: string;
  text: Text;
  keyboard?: KeyboardBuilder;
}

@Injectable()
export class MenuService {
  private readonly menu: MenuItemDeclaration;

  constructor(
    @Inject(MENU_OPTIONS) options: MenuModuleOptions,
    private readonly menuHandlerService: MenuHandlerService,
  ) {
    this.menu = options.menu;
  }

  public enterMenu(stringPath: string): MenuResult {
    return this.renderMenu(new StringPath(stringPath), this.menu);
  }

  public async handle(ctx: BotMessage, stringPath: string): Promise<MenuResult | undefined> {
    const path = new StringPath(stringPath);

    const isBack = MessageMatchChecker.Match([BackMenuButton.id], ctx.payload.text);
    return this.callItem(path, ctx, isBack ? 'up' : 'down');
  }

  private async callItem(
    path: StringPath,
    ctx: BotMessage,
    direction?: 'up' | 'down',
    data?: any,
  ): Promise<MenuResult | undefined> {
    let oldItem: MenuItemDeclaration | undefined = undefined;
    let currentItem = this.getItem(path);
    if (!currentItem) return;

    if (direction) {
      if (direction == 'up') {
        path.up();
        return this.callItem(path, ctx);
      }

      oldItem = currentItem;

      const child = this.getChild(ctx.payload.text, currentItem);
      if (child) {
        path.down(child.stage);
        currentItem = child;
      }
    }

    if (currentItem.instance.type == 'button' || oldItem?.instance.type == 'input') {
      const value = (<ValueMenu>currentItem.instance).parse(ctx.payload.text);
      const result = await this.menuHandlerService.callValueHandler(ctx, { path: path.get(), value: value });
      if (result?.stage) path.set(result.stage);
      else path.up();

      return this.callItem(path, ctx, undefined, result?.data);
    } else {
      const result = await this.menuHandlerService.callMenuEnterHandler(ctx, { path: path.get() });
      if (result?.stage) {
        path.set(result.stage);
        return this.callItem(path, ctx);
      } else return this.renderMenu(path, currentItem, data || result?.data);
    }
  }

  private renderMenu(path: StringPath, item: MenuItemDeclaration, data?: any): MenuResult {
    const text = item.instance.renderContent(data);
    if (!text) throw new Error(`Menu item ${path.get()} has no rendering content`);
    return {
      path: path.get(),
      text: text,
      keyboard: this.buildKeyboard(item, data),
    };
  }

  private buildKeyboard(item: MenuItemDeclaration, data?: any): KeyboardBuilder {
    const children = item.children || [];
    const keyboard = new KeyboardBuilder();

    const extraHeaders = item.instance.extraHeaders();
    if (extraHeaders.length > 0) {
      for (const extraHeader of extraHeaders) {
        keyboard.add(new TextButton(extraHeader));
      }
      keyboard.row();
    }

    for (const row of children) {
      for (const column of row) {
        if (column.instance.isHidden(data)) continue;
        const header = column.instance.renderHeader(data);
        keyboard.add(new TextButton(header));
      }
      keyboard.row();
    }
    keyboard.add(BackMenuButton);

    return keyboard;
  }

  private getItem(path: StringPath): MenuItemDeclaration | undefined {
    let item: MenuItemDeclaration | undefined;

    for (const stage of path.parts) {
      if (this.menu.stage == stage) {
        item = this.menu;
        continue;
      }

      if (item) {
        item = lodash.flatten(item.children).find((child) => child.stage == stage);
      } else break;
    }

    return item;
  }

  private getChild(message: string, currentItem: MenuItemDeclaration): MenuItemDeclaration | undefined {
    const children = lodash.flatten(currentItem.children);
    return children.find((child) => child.instance.isValid(message));
  }
}
