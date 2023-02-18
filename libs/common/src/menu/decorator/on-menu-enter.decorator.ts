import { SetMetadata } from '@nestjs/common';

import { MENU_ENTER } from './accessor/menu-metadata.accessor';
import { MenuHandlerMetadata } from './accessor/type/menu-handler.metadata';

export const OnMenuEnter = (path: string): MethodDecorator => {
  const metadata: MenuHandlerMetadata = {
    path: path,
  };

  return SetMetadata<string, MenuHandlerMetadata>(MENU_ENTER, metadata);
};
