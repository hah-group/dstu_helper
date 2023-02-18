import { Content } from '../../content';

export interface MenuItemDeclaration {
  stage: string;
  instance: MenuItem;
  children?: MenuItemDeclaration[][];
}

export type MenuItemType = 'page' | 'button' | 'input';

export abstract class MenuItem<T = any> {
  public readonly type: MenuItemType;

  public readonly header: Content | string;
  public readonly content?: string;

  protected constructor(type: MenuItemType, header: Content | string, content?: string) {
    this.type = type;
    this.header = header;
    this.content = content;
  }

  public renderHeader(data?: T): Content {
    if (typeof this.header == 'string') return Content.Build(this.header, data);
    else return this.header;
  }

  public renderContent(data?: T): Content | undefined {
    return this.content ? Content.Build(this.content, data) : undefined;
  }

  public abstract isValid(input: string): boolean;

  public extraHeaders(): Content[] {
    return [];
  }

  public isHidden(data?: T): boolean {
    return false;
  }
}
