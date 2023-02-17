import { MenuContext, MenuValueContext } from './menu-handler.type';

export interface MenuValueParamDecoratorMetadataItem<T> {
  factory: (menuCtx: MenuContext & Partial<MenuValueContext>, sourcePath: string) => T;
  index: number;
}

export type MenuValueParamDecoratorMetadata = MenuValueParamDecoratorMetadataItem<any>[];
