import { MessageMatchChecker } from '@dstu_helper/bot';

import { Content } from '../../content';
import { ValueMenu } from '../type';

export class ButtonValueMenu<V = any, T = any> extends ValueMenu<T> {
  private readonly value: keyof V;

  protected constructor(header: Content, value: keyof V) {
    super('button', header);
    this.value = value;
  }

  public renderHeader(): Content {
    return <Content>this.header;
  }

  public isValid(input: string): boolean {
    return MessageMatchChecker.Match([(<Content>this.header).render()], input);
  }

  public parse(input: string): keyof V {
    return this.value;
  }
}
