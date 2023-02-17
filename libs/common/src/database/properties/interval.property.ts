import { PropertyBase } from './base/property.base';

export class IntervalProperty extends PropertyBase<number, number> {
  private value: number;

  constructor(name: string, value: number) {
    super(name);
    this.value = value;
  }

  public get(): number {
    return this.value;
  }

  public render(): number {
    return this.value;
  }

  public set(value: number): void {
    this.value = value;
  }

  public isEquals(value: number): boolean {
    return value === this.value;
  }
}
