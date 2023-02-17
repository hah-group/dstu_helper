import { Text } from '../../../../../apps/dstu-helper/src/framework/text/text';
import { MenuItem } from './menu-item';
import { MessageMatchChecker } from '../../../../../apps/dstu-helper/src/framework/bot/checker/message-match.checker';

export class PageMenu<T = any> extends MenuItem<T> {
  constructor(header: Text, content: string) {
    super('page', header, content);
  }

  public isValid(input: string): boolean {
    return MessageMatchChecker.Match([(<Text>this.header).render()], input);
  }
}
