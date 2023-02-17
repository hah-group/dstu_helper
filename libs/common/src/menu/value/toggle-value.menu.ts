import { ValueMenu, ValueMenuOptions } from '../type/value.menu';
import { Text } from '../../../../../apps/dstu-helper/src/framework/text/text';

export abstract class ToggleValueMenu<T = any> extends ValueMenu<T> {
  private readonly validValues?: string[];
  private readonly accessor?: keyof T;

  protected constructor(header: string, validValues?: string[], accessor?: keyof T, options?: ValueMenuOptions<T>) {
    super('button', header, undefined, options);
    this.validValues = validValues;
    this.accessor = accessor;
  }

  public renderHeader(data?: T): Text {
    const renderData = data && (this.accessor ? { value: data[this.accessor] } : data);
    return Text.Build(<string>this.header, renderData);
  }

  public isValid(input: string): boolean {
    if (!this.validValues) return true;
    return this.validValues.includes(input);
  }
}
