import { BotContext } from '../../type/bot-context.type';

export interface ParamDecoratorMetadataItem<T> {
  factory: (ctx: BotContext) => T;
  index: number;
}

export type ParamDecoratorMetadata = ParamDecoratorMetadataItem<any>[];
