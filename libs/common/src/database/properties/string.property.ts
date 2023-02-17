import { PropertyBase } from './base/property.base';

export class StringProperty<T extends string = string> extends PropertyBase<T> {
  private readonly defaultValue: T;
  private value?: T;

  constructor(name: string, defaultValue: T, value?: T) {
    super(name);
    this.value = value;
    this.defaultValue = defaultValue;
  }

  public get(): T {
    return this.value || this.defaultValue;
  }

  public render(): T {
    return this.value || this.defaultValue;
  }

  public set(value?: T): void {
    this.value = value || this.defaultValue;
  }

  public isEquals(value: T): boolean {
    return this.value == value;
  }
}
