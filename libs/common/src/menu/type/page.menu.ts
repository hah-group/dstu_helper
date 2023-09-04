import { MessageMatchChecker } from '../../bot/checker/message-match.checker';
import { Content } from '../../content';
import { MenuItem } from './menu-item';

export class PageMenu<T = any> extends MenuItem<T> {
  constructor(header: Content, content: string) {
    super('page', header, content);
  }

  public isValid(input: string): boolean {
    return MessageMatchChecker.Match([(<Content>this.header).render()], input);
  }
}
