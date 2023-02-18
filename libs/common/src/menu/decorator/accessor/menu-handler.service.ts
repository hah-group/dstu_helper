import {
  BotMessage,
  MenuContext,
  MenuEnterHandler,
  MenuHandlerResponse,
  MenuValueContext,
  ValueHandler,
} from '@dstu_helper/common';
import { Injectable } from '@nestjs/common';
import * as micromatch from 'micromatch';

interface HandlerItem<T> {
  path: string;
  handler: T;
}

@Injectable()
export class MenuHandlerService {
  private menuEnterHandler: HandlerItem<MenuEnterHandler>[] = [];
  private valueHandler: HandlerItem<ValueHandler>[] = [];

  public registerMenuEnterHandler(path: string, handler: MenuEnterHandler): void {
    this.menuEnterHandler.push({
      path: this.formatPaths(path),
      handler: handler,
    });
  }

  public registerValueHandler(path: string, handler: ValueHandler): void {
    this.valueHandler.push({
      path: this.formatPaths(path),
      handler: handler,
    });
  }

  public async callMenuEnterHandler(
    botCtx: BotMessage,
    menuCtx: MenuContext,
  ): Promise<MenuHandlerResponse | undefined> {
    const handlerItem = this.menuEnterHandler.find((item) => {
      return micromatch.isMatch(menuCtx.path, item.path, { format: this.formatPaths });
    });
    if (handlerItem) {
      return handlerItem.handler(botCtx, menuCtx);
    }
  }

  public async callValueHandler(
    botCtx: BotMessage,
    menuCtx: MenuContext & MenuValueContext,
  ): Promise<MenuHandlerResponse | undefined> {
    const handlerItem = this.valueHandler.find((item) => {
      return micromatch.isMatch(menuCtx.path, item.path, { format: this.formatPaths });
    });
    if (handlerItem) {
      return handlerItem.handler(botCtx, menuCtx);
    }
  }

  private formatPaths(path: string): string {
    return path.replace('.', '/');
  }
}
