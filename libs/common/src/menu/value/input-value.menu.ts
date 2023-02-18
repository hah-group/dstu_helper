import { Content } from '@dstu_helper/common';

import { ValueMenu, ValueMenuOptions } from '../type/value.menu';

export abstract class InputValueMenu<T = any> extends ValueMenu<T> {
  private readonly suggestions?: Content[];

  protected constructor(header: string, content: string, suggestions: Content[], options?: ValueMenuOptions<T>) {
    super('input', header, content, options);
    this.suggestions = suggestions;
  }

  public renderHeader(data?: T): Content {
    return Content.Build(<string>this.header, data);
  }

  public isValid(input: string): boolean {
    return true;
  }

  public extraHeaders(): Content[] {
    return this.suggestions || [];
  }
}
