import { TimeMiddlePartDefinition, TimeNightPartDefinition, TimePartDefinition } from './time-scale.definition';
import { Moment, TimeType } from '@dstu_helper/common';

export class TimeParser {
  public static Parse(input: string): TimeType | undefined {
    const timeRegex = new RegExp(`(^В|:|${TimePartDefinition})`, 'ig');
    if (input.match(timeRegex)) {
      let time = Moment(input, 'HH:mm');
      if (!time.isValid()) return;

      const middleTimeRegex = new RegExp(`(${TimeMiddlePartDefinition})`, 'i');
      if (input.match(middleTimeRegex) && time.hours() < 12) time = time.add(12, 'hours');

      const nightTimeRegex = new RegExp(`(${TimeNightPartDefinition})`, 'i');
      if (input.match(nightTimeRegex) && time.hours() == 12) time = time.hours(0);

      //Doubtful thing. Adds 12 hours to values that seem strange to the user's life
      //For example, when you write 5:00, it's strange to do something at 5 am, it's more like evening
      //But to avoid incomprehensible behavior for the user,
      //this thing is not used (but may be will be used in the future)
      //if (!input.match(TimePartDefinition) && time.hours() < 6) time = time.add(12, 'hours');

      return {
        type: 'time',
        value: time.format('HH:mm'),
      };
    }
  }
}
