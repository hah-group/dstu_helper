import { Text } from '../../../../../apps/dstu-helper/src/framework/text/text';

export interface MenuItemDeclaration {
  stage: string;
  instance: MenuItem;
  children?: MenuItemDeclaration[][];
}

export type MenuItemType = 'page' | 'button' | 'input';

export abstract class MenuItem<T = any> {
  public readonly type: MenuItemType;

  public readonly header: Text | string;
  public readonly content?: string;

  protected constructor(type: MenuItemType, header: Text | string, content?: string) {
    this.type = type;
    this.header = header;
    this.content = content;
  }

  public renderHeader(data?: T): Text {
    if (typeof this.header == 'string') return Text.Build(this.header, data);
    else return this.header;
  }

  public renderContent(data?: T): Text | undefined {
    return this.content ? Text.Build(this.content, data) : undefined;
  }

  public abstract isValid(input: string): boolean;

  public extraHeaders(): Text[] {
    return [];
  }

  public isHidden(data?: T): boolean {
    return false;
  }
}
