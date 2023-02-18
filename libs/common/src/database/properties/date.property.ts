import { DateTime, Moment } from '@dstu_helper/common';

import { PropertyBase } from './base/property.base';

export class DateProperty extends PropertyBase<DateTime, Date> {
  private value: DateTime;

  constructor(name: string, value: Date | DateTime) {
    super(name);
    this.value = Moment(value);
  }

  public get(): DateTime {
    return this.value;
  }

  public render(): Date {
    return this.value.toDate();
  }

  public set(value: DateTime): void {
    this.value = value;
  }

  public isEquals(value: DateTime): boolean {
    return this.value.isSame(value, 's');
  }
}
