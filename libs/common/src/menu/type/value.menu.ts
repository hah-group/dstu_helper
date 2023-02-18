import { Content } from '../../content';
import { MenuItem, MenuItemType } from './menu-item';

type Negative<T> = keyof { [K in keyof T as `!${string & K}`]: never };
export type ValueMenuOptions<T = any> = Partial<{
  isHidden: keyof T | Negative<T> | ((data?: T) => boolean);
}>;

export abstract class ValueMenu<T = any> extends MenuItem<T> {
  public readonly options?: ValueMenuOptions<T>;

  protected constructor(type: MenuItemType, header: Content | string, content?: string, options?: ValueMenuOptions<T>) {
    super(type, header, content);
    this.options = options;
  }

  public abstract parse(input: string): any;

  public isHidden(data?: T): boolean {
    if (!this.options?.isHidden || !data) return false;

    if (typeof this.options.isHidden == 'string') {
      const negative = this.options.isHidden.indexOf('!') > -1;

      const index = this.options.isHidden.replace('!', '') as keyof T;
      const result = !!data[index];
      return negative != result;
    } else if (typeof this.options.isHidden == 'function') return this.options.isHidden(data);

    return false;
  }
}
