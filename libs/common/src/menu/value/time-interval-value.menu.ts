import { Content, TimeInterval, TimeIntervalParser, ValueMenuOptions } from '@dstu_helper/common';

import { InputValueMenu } from './input-value.menu';

export class TimeIntervalValueMenu extends InputValueMenu {
  constructor(header: string, content: string, suggestions: Content[], options?: ValueMenuOptions) {
    super(header, content, suggestions, options);
  }

  public parse(input: string): TimeInterval | undefined {
    return TimeIntervalParser.Parse(input);
  }
}
