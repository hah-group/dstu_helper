import { Content } from '../../content';
import { ValueMenu, ValueMenuOptions } from '../type';

export type ValidValuesType<T = any> = T | (() => T);

export abstract class ToggleValueMenu<T = any> extends ValueMenu<T> {
  private readonly validValues?: ValidValuesType<string[]>;
  private readonly accessor?: keyof T;

  protected constructor(
    header: string,
    validValues?: ValidValuesType<string[]>,
    accessor?: keyof T,
    options?: ValueMenuOptions<T>,
  ) {
    super('button', header, undefined, options);
    this.validValues = validValues;
    this.accessor = accessor;
  }

  public renderHeader(data?: T): Content {
    const renderData = data && (this.accessor ? { value: data[this.accessor] } : data);
    return Content.Build(<string>this.header, renderData);
  }

  public isValid(input: string): boolean {
    if (!this.validValues) return true;

    let validValues: string[];
    if (typeof this.validValues == 'function') validValues = this.validValues();
    else validValues = this.validValues;

    return validValues.includes(input);
  }
}
