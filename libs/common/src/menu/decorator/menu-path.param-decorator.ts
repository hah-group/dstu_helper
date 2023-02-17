import { MENU_PARAMS } from './accessor/menu-metadata.accessor';
import { MenuValueParamDecoratorMetadata } from './accessor/type/menu-param.type';

export const MenuPath = (): ParameterDecorator => {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    const params: MenuValueParamDecoratorMetadata =
      Reflect.getMetadata(MENU_PARAMS, target.constructor, propertyKey) || [];
    params.push({
      factory: (menuCtx) => menuCtx.path,
      index: parameterIndex,
    });

    Reflect.defineMetadata(MENU_PARAMS, params, target.constructor, propertyKey);
  };
};
