import {
  TimeIntervalHoursDefinition,
  TimeIntervalHoursFullDefinition,
  TimeIntervalMinutesDefinition,
  TimeIntervalMinutesFullDefinition,
} from './relative-time-scale.definition';
import { lodash, TimeInterval } from '@dstu_helper/common';
import { TimeParser } from '../time-parser/time-parser';

export class TimeIntervalTimeParser {
  public static Parse(input: string): TimeInterval | undefined {
    const time = TimeParser.Parse(input);
    if (time) return time;

    const numberInterval = this.tryParseNumberInterval(input);
    if (numberInterval) return numberInterval;

    const stringInterval = this.tryParseStringInterval(input);
    if (stringInterval) return stringInterval;
  }

  private static tryParseNumberInterval(input: string): TimeInterval | undefined {
    const regex = new RegExp(
      `([\\d.,]+ ?(?:${TimeIntervalHoursDefinition}(?:|$| )|${TimeIntervalMinutesDefinition})?)`,
      'gi',
    );
    const match = input.match(regex);
    if (match && match.length > 0) {
      let interval = 0;
      for (let part of match) {
        part = part.replace(',', '.');
        const number = lodash.toNumber(part.match(/[\d.,]+/gi));
        if (!lodash.isFinite(number)) continue;

        const quantifierRegex = new RegExp(`(${TimeIntervalHoursDefinition}|${TimeIntervalMinutesDefinition})`, 'gi');
        const quantifier = part.match(quantifierRegex);
        if (quantifier && quantifier[0]) {
          if (quantifier[0].indexOf(TimeIntervalHoursDefinition) > -1) interval += 60 * 60 * number;
          else if (quantifier[0].indexOf(TimeIntervalMinutesDefinition) > -1) interval += 60 * number;
          continue;
        }

        interval += 60 * 60 * number; //By default, consider that the figure without a quantifier is hours
      }

      if (interval > 0)
        return {
          type: 'interval',
          value: interval,
        };
    }
  }

  private static tryParseStringInterval(input: string): TimeInterval | undefined {
    if (input.indexOf(TimeIntervalHoursFullDefinition) > -1) return { type: 'interval', value: 60 * 60 };
    else if (input.indexOf(TimeIntervalMinutesFullDefinition) > -1) return { type: 'interval', value: 60 };
  }
}
