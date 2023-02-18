import { IntervalProperty, lodash, PropertyBase, TimeProperty } from '@dstu_helper/common';

export type TimeInterval = TimePropertyType | IntervalPropertyType;
export type TimeIntervalPropertyType = TimeInterval | undefined;

export interface TimePropertyType {
  type: 'time';
  value: string;
}

export interface IntervalPropertyType {
  type: 'interval';
  value: number;
}

export class TimeIntervalProperty extends PropertyBase<TimeIntervalPropertyType | undefined> {
  private value: TimeProperty | IntervalProperty | undefined;

  constructor(name: string, value?: TimeIntervalPropertyType) {
    super(name);
    this.set(value);
  }

  public get(): TimeIntervalPropertyType | undefined {
    return undefined;
  }

  public isEquals(value: TimeIntervalPropertyType): boolean {
    if (!this.value) return false;
    return lodash.isEqual(this.value, value);
  }

  public render(): TimeIntervalPropertyType | undefined {
    if (!this.value) return;
    if (this.value instanceof TimeProperty) return { type: 'time', value: this.value.render() };
    else return { type: 'interval', value: this.value.render() };
  }

  public set(value: TimeIntervalPropertyType | undefined): void {
    if (value?.type == 'time') this.value = new TimeProperty('time', value.value);
    else if (value?.type == 'interval') this.value = new IntervalProperty('interval', value.value);
  }
}
