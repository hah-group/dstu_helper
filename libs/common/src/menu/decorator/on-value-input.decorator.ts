import { SetMetadata } from '@nestjs/common';

import { VALUE_INPUT } from './accessor/menu-metadata.accessor';
import { MenuHandlerMetadata } from './accessor/type/menu-handler.metadata';

export const OnValueInput = (path: string): MethodDecorator => {
  const metadata: MenuHandlerMetadata = {
    path: path,
  };

  return SetMetadata<string, MenuHandlerMetadata>(VALUE_INPUT, metadata);
};
