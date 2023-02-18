import * as micromatch from 'micromatch';

import { MENU_PARAMS } from './accessor/menu-metadata.accessor';
import { MenuValueParamDecoratorMetadata } from './accessor/type/menu-param.type';

export const MenuTargets = (): ParameterDecorator => {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    const params: MenuValueParamDecoratorMetadata =
      Reflect.getMetadata(MENU_PARAMS, target.constructor, propertyKey) || [];
    params.push({
      factory: (menuCtx, sourcePath) => {
        sourcePath = sourcePath.replace('.', '/');
        const inputPath = menuCtx.path.replace('.', '/');

        const capture = micromatch.capture(sourcePath, inputPath);
        return capture || [];
      },
      index: parameterIndex,
    });

    Reflect.defineMetadata(MENU_PARAMS, params, target.constructor, propertyKey);
  };
};
