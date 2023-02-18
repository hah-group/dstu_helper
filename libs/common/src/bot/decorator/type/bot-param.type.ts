import { BotContext } from '@dstu_helper/common';

export interface ParamDecoratorMetadataItem<T> {
  factory: (ctx: BotContext) => T;
  index: number;
}

export type ParamDecoratorMetadata = ParamDecoratorMetadataItem<any>[];
