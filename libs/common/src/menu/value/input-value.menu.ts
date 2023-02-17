import { ValueMenu, ValueMenuOptions } from '../type/value.menu';
import { Text } from '../../../../../apps/dstu-helper/src/framework/text/text';

export abstract class InputValueMenu<T = any> extends ValueMenu<T> {
  private readonly suggestions?: Text[];

  protected constructor(header: string, content: string, suggestions: Text[], options?: ValueMenuOptions<T>) {
    super('input', header, content, options);
    this.suggestions = suggestions;
  }

  public renderHeader(data?: T): Text {
    return Text.Build(<string>this.header, data);
  }

  public isValid(input: string): boolean {
    return true;
  }

  public extraHeaders(): Text[] {
    return this.suggestions || [];
  }
}
