import { SetMetadata } from '@nestjs/common';
import { MenuHandlerMetadata } from './accessor/type/menu-handler.metadata';
import { VALUE_INPUT } from './accessor/menu-metadata.accessor';

export const OnValueInput = (path: string): MethodDecorator => {
  const metadata: MenuHandlerMetadata = {
    path: path,
  };

  return SetMetadata<string, MenuHandlerMetadata>(VALUE_INPUT, metadata);
};
