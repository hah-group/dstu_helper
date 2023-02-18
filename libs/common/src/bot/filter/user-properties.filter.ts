import { BotContext, UserPropertyFilterMetadata } from '@dstu_helper/common';

import { Filter } from './filter.type';

export class UserPropertiesFilter extends Filter<UserPropertyFilterMetadata> {
  constructor(metadata: UserPropertyFilterMetadata) {
    super(metadata);
  }

  public check(context: BotContext): boolean {
    const properties = context.from.user.properties;
    return this.metadata.values.some((value) => {
      if (typeof value == 'function') {
        return value(properties[this.metadata.property].get());
      } else {
        return properties[this.metadata.property].isEquals(<any>value);
      }
    });
  }
}
