import { EntityProperty, Platform, Type } from '@mikro-orm/core';
import { UserProperties } from './user-properties';

export class UserPropertiesType extends Type<UserProperties | undefined, Record<string, any>> {
  convertToDatabaseValue(value: UserProperties | undefined): Record<string, any> {
    if (!value) value = new UserProperties();
    return value.toJSON();
  }

  convertToJSValue(value: UserProperties | Record<string, any> | undefined): UserProperties {
    let result: UserProperties;

    if (!(value instanceof UserProperties)) {
      if (value) result = new UserProperties(value);
      else result = new UserProperties();
    } else {
      result = value;
    }

    return result;
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return `json`;
  }
}
