import * as moment from 'moment';

const MNEMONIC_REGEX =
  /(завтра|послезавтра|понедельник|пн|вторник|вт|среду|ср|четверг|чт|пятницу|пт|субботу|сб|воскресенье|вс)(?= |$)/gi;

const FULL_REGEX = /(фул|полное|все|всё)/gi;

export class DateParser {
  public static Parse(message: string): moment.Moment {
    let dateMnemonic = '';
    const mnemonicMatches = message.match(MNEMONIC_REGEX);
    if (mnemonicMatches) dateMnemonic = mnemonicMatches[0];

    const fullSchedule = !!message.match(FULL_REGEX);

    const atDate = this.dateFromMnemonic(dateMnemonic);

    return atDate.startOf('d');
    /* Math.abs(
      moment().startOf('d').diff(moment(atDate).startOf('d'), 'd'),
    ) > 0 || fullSchedule
      ? atDate.startOf('d')
      : */
  }

  private static dateFromMnemonic(mnemonic: string): moment.Moment {
    const date = moment();
    if (mnemonic === '') return date;

    const weekDay = this.weekParser(mnemonic);
    if (weekDay > -1) {
      if (date.isoWeekday() > weekDay) date.startOf('isoWeek').add(1, 'w').isoWeekday(weekDay);
      else if (date.isoWeekday() < weekDay) date.startOf('isoWeek').isoWeekday(weekDay);
      else date.add(1, 'w');

      return date;
    }

    const relativeAdd = this.relativeAdd(mnemonic);
    if (relativeAdd > 0) date.add(relativeAdd, 'd');

    return date;
  }

  private static relativeAdd(mnemonic: string): number {
    if (mnemonic.match(/(послезавтра)(?= |$)/gi)) return 2;
    else if (mnemonic.match(/(завтра)(?= |$)/gi)) return 1;
    else return 0;
  }

  private static weekParser(mnemonic: string): number {
    if (mnemonic.match(/(понедельник|пн)(?= |$)/gi)) return 1;
    else if (mnemonic.match(/(вторник|вт)(?= |$)/gi)) return 2;
    else if (mnemonic.match(/(среду|ср)(?= |$)/gi)) return 3;
    else if (mnemonic.match(/(четверг|чт)(?= |$)/gi)) return 4;
    else if (mnemonic.match(/(пятницу|пт)(?= |$)/gi)) return 5;
    else if (mnemonic.match(/(субботу|сб)(?= |$)/gi)) return 6;
    else if (mnemonic.match(/(воскресенье|вс)(?= |$)/gi)) return 7;
    else return -1;
  }
}
