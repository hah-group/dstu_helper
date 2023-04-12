import { BotMessage } from '@dstu_helper/common';

export type MenuHandlerResponse<T = any> = MenuHandlerResponseData<T> | undefined;

export interface MenuHandlerResponseData<T = any> {
  stage?: string;
  data?: T;
}

export interface MenuContext {
  path: string;
}

export interface MenuValueContext {
  value: any;
}

export type MenuEnterHandler = (botCtx: BotMessage, menuCtx: MenuContext) => Promise<MenuHandlerResponse>;
export type ValueHandler = (
  botCtx: BotMessage,
  menuCtx: MenuContext & MenuValueContext,
) => Promise<MenuHandlerResponse>;