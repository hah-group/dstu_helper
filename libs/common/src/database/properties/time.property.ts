import { DateTime, Moment } from '@dstu_helper/common';
import { PropertyBase } from './base/property.base';

export class TimeProperty extends PropertyBase<DateTime, string> {
  private value: DateTime;

  constructor(name: string, value: string) {
    super(name);
    this.value = Moment(value, 'HH:mm');
  }

  public get(): DateTime {
    return this.value;
  }

  public render(): string {
    return `${this.value.format('HH:mm')}`;
  }

  public set(value: DateTime): void {
    this.value = value;
  }

  public isEquals(value: DateTime): boolean {
    return this.value.isSame(value, 'm');
  }
}
