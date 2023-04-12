//TODO FIX IT!!!!!
import { UserEntity } from '../../../../apps/dstu-helper/src/modules/user/user.entity';
import { BOT_PARAMS } from './accessor/contains';
import { ParamDecoratorMetadata, ParamDecoratorMetadataItem } from './type/bot-param.type';

export const User = (): ParameterDecorator => {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    const params: ParamDecoratorMetadata = Reflect.getMetadata(BOT_PARAMS, target.constructor, propertyKey) || [];
    params.push(<ParamDecoratorMetadataItem<UserEntity>>{
      factory: (ctx) => ctx.from.user,
      index: parameterIndex,
    });

    Reflect.defineMetadata(BOT_PARAMS, params, target.constructor, propertyKey);
  };
};
