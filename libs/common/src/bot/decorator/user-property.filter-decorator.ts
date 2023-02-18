import { SetMetadata } from '@nestjs/common';

//TODO FIX IT!!!
import { UserProperties } from '../../../../../apps/dstu-helper/src/modules/user/user-properties/user-properties';
import { UserPropertiesFilter } from '../filter/user-properties.filter';
import { BOT_FILTER } from './accessor/bot-metadata.accessor';
import { FilterDecoratorMetadata } from './type/bot-filter.type';

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
