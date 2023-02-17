import { Text } from '../../../../../apps/dstu-helper/src/framework/text/text';
import { InputValueMenu } from './input-value.menu';
import { TimeType, ValueMenuOptions } from '@dstu_helper/common';
import { TimeParser } from '../../../../../apps/dstu-helper/src/framework/util/time-parser/time-parser';

export class TimeValueMenu extends InputValueMenu {
  constructor(header: string, content: string, suggestions: Text[], options?: ValueMenuOptions) {
    super(header, content, suggestions, options);
  }

  public parse(input: string): TimeType | undefined {
    return TimeParser.Parse(input);
  }
}
