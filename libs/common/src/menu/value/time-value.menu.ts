import { Content, TimeParser, TimeType, ValueMenuOptions } from '@dstu_helper/common';

import { InputValueMenu } from './input-value.menu';

export class TimeValueMenu extends InputValueMenu {
  constructor(header: string, content: string, suggestions: Content[], options?: ValueMenuOptions) {
    super(header, content, suggestions, options);
  }

  public parse(input: string): TimeType | undefined {
    return TimeParser.Parse(input);
  }
}
