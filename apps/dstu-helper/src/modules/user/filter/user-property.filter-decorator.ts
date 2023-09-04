import { BOT_FILTER, FilterDecoratorMetadata } from '@dstu_helper/common';
import { SetMetadata } from '@nestjs/common';

import { UserProperties } from '../user-properties/user-properties';
import { UserPropertiesFilter } from './user-properties.filter';

type UserPropertyKeys = keyof Omit<UserProperties, 'render'>;
type UserPropertyValues<T extends UserPropertyKeys = UserPropertyKeys> = UserProperties[T]['_type'];

export type FilterConditionValue = (value: UserPropertyValues) => boolean;

type UserPropertyFilterType<T extends UserPropertyKeys = UserPropertyKeys> = (
  property: T,
  value: UserProperties[T]['_type'] | UserProperties[T]['_type'][] | FilterConditionValue | FilterConditionValue[],
) => MethodDecorator;

export interface UserPropertyFilterMetadata {
  property: UserPropertyKeys;
  values: (UserPropertyValues | FilterConditionValue)[];
}

export const UserPropertyFilter: UserPropertyFilterType = (property, value): MethodDecorator => {
  const metadata: UserPropertyFilterMetadata = {
    property: property,
    values: Array.isArray(value) ? value : [value],
  };
  return SetMetadata<string, FilterDecoratorMetadata>(BOT_FILTER, {
    filters: [new UserPropertiesFilter(metadata)],
  });
};
