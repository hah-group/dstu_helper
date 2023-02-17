import { ValueMenu } from '../type/value.menu';
import { Text } from '../../../../../apps/dstu-helper/src/framework/text/text';
import { MessageMatchChecker } from '../../../../../apps/dstu-helper/src/framework/bot/checker/message-match.checker';

export class ButtonValueMenu<V = any, T = any> extends ValueMenu<T> {
  private readonly value: keyof V;
  protected constructor(header: Text, value: keyof V) {
    super('button', header);
    this.value = value;
  }

  public renderHeader(): Text {
    return <Text>this.header;
  }

  public isValid(input: string): boolean {
    return MessageMatchChecker.Match([(<Text>this.header).render()], input);
  }

  public parse(input: string): keyof V {
    return this.value;
  }
}
