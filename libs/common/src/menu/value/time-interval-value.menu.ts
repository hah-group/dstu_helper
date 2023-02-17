import { Text } from '../../../../../apps/dstu-helper/src/framework/text/text';
import { InputValueMenu } from './input-value.menu';
import { TimeInterval, ValueMenuOptions } from '@dstu_helper/common';
import {
  TimeIntervalTimeParser,
} from '../../../../../apps/dstu-helper/src/framework/util/relative-time-parser/time-interval-time.parser';

export class TimeIntervalValueMenu extends InputValueMenu {
  constructor(header: string, content: string, suggestions: Text[], options?: ValueMenuOptions) {
    super(header, content, suggestions, options);
  }

  public parse(input: string): TimeInterval | undefined {
    return TimeIntervalTimeParser.Parse(input);
  }
}
