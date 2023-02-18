import { DateTime, Moment, Time } from '@dstu_helper/common';
import { Logger } from '@nestjs/common';
import { parseInt } from 'lodash';

export const MNEMONIC_REGEX_BODY =
  '((?:поза *)*вчера|сегодня|завтра|(?:после *)*завтра|понедельник|пн|вторник|вт|среду|ср|четверг|чт|пятницу|пт|субботу|сб|воскресенье|вс)(?= |$)';
const MNEMONIC_REGEX = new RegExp(MNEMONIC_REGEX_BODY, 'i');

export const DATE_REGEX_BODY =
  '(\\d{1,2}) (январ|феврал|март|апрел|ма|июн|июл|август|сентябр|октябр|ноябр|декабр|число)[а-я]? ?(\\d{2,4})?|\\d{1,2}[.\\/\\- ]\\d{1,2}(?:[.\\/\\- ]\\d{2,4})?';
const DATE_REGEX = new RegExp(DATE_REGEX_BODY, 'i');

export const FULL_DATE_REGEX_BODY = '(\\d{1,2})[.\\/\\- ](\\d{1,2})(?:[.\\/\\- ](\\d{2,4}))?';
const FULL_DATE_REGEX = new RegExp(FULL_DATE_REGEX_BODY, 'i');

export const ANY_DATE = `${MNEMONIC_REGEX_BODY}|${DATE_REGEX_BODY}|${FULL_DATE_REGEX_BODY}`;

export class DateParser {
  private static readonly log = new Logger('DateParser');

  public static Parse(message: string, currentDate: DateTime = Time.get()): DateTime {
    try {
      const mnemonicMatches = message.match(MNEMONIC_REGEX);
      if (mnemonicMatches) return this.startOfDay(this.dateFromMnemonic(message, currentDate));

      const dateMatched = message.match(DATE_REGEX);
      if (dateMatched) return this.startOfDay(this.dateFromDate(dateMatched, currentDate));

      return this.startOfDay(Time.get());
    } catch (e) {
      if (e instanceof Error) {
        this.log.error(`Date parsing error: ${message}`);
        this.log.error(e.stack);
      }

      return this.startOfDay(currentDate);
    }
  }

  private static startOfDay(date: DateTime): DateTime {
    return date.startOf('d');
  }

  private static dateFromDate(matches: RegExpMatchArray, currentDate: DateTime): DateTime {
    const date = Moment(currentDate);

    if (!matches) return date;
    const fullDate = matches[0].match(FULL_DATE_REGEX);
    if ((matches.length < 3 || matches.length > 4) && !fullDate) return date;

    if (fullDate && fullDate.length > 2) {
      const day = fullDate[1];
      const month = fullDate[2];
      const year = fullDate[3];
      if (year) date.year(parseInt(year));
      else if (date.month() > parseInt(month) - 1) date.add(1, 'y');

      date.month(parseInt(month) - 1);
      date.date(parseInt(day));
      return date;
    }

    const day = parseInt(matches[1]);
    const month = this.monthParser(matches[2]);
    const year = matches[3];
    const inCurrentMonth = !!matches[2].match(/.*число.*/i);
    if (month < 0 && !inCurrentMonth) return date;

    if (year) {
      const yearNumber = parseInt(year.length > 2 ? year : `20${year}`);
      date.year(yearNumber);
    } else if (!inCurrentMonth && date.month() > month) date.add(1, 'y');

    if (!inCurrentMonth) date.month(month);

    date.date(day);

    return date;
  }

  private static dateFromMnemonic(message: string, currentDate: DateTime): DateTime {
    const date = Moment(currentDate);
    if (message === '') return date;

    const weekDay = this.weekParser(message);
    if (weekDay > -1) {
      if (date.isoWeekday() > weekDay) date.startOf('isoWeek').add(1, 'w').isoWeekday(weekDay);
      else if (date.isoWeekday() < weekDay) date.startOf('isoWeek').isoWeekday(weekDay);
      else date.add(1, 'w');

      return date;
    }

    const relativeAdd = this.relativeAdd(message, currentDate);
    date.add(relativeAdd, 'd');

    return date;
  }

  private static relativeAdd(mnemonic: string, currentDate: DateTime): number {
    let add = 0;

    const currentHours = currentDate.hour();

    const afterMatch = mnemonic.match(/(после)/gi);
    const beforeMatch = mnemonic.match(/(поза)/gi);
    if (afterMatch) add += afterMatch.length;
    if (beforeMatch) add += beforeMatch.length * -1;

    if (add == 0 && mnemonic.match(/(сегодня|завтра)/gi) && currentHours >= 0 && currentHours < 3) return 0;
    else if (add == 0 && mnemonic.match(/(вчера)/gi) && currentHours >= 0 && currentHours < 3) return -2;

    if (mnemonic.match(/(завтра)/gi)) add += 1;
    if (mnemonic.match(/(вчера)/gi)) add -= 1;
    return add;
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

  private static monthParser(mnemonic: string): number {
    if (mnemonic.match(/.*январ.*/i)) return 0;
    else if (mnemonic.match(/.*феврал.*/i)) return 1;
    else if (mnemonic.match(/.*март.*/i)) return 2;
    else if (mnemonic.match(/.*апрел.*/i)) return 3;
    else if (mnemonic.match(/.*ма.*/i)) return 4;
    else if (mnemonic.match(/.*июн.*/i)) return 5;
    else if (mnemonic.match(/.*июл.*/i)) return 6;
    else if (mnemonic.match(/.*август.*/i)) return 7;
    else if (mnemonic.match(/.*сентябр.*/i)) return 8;
    else if (mnemonic.match(/.*октябр.*/i)) return 9;
    else if (mnemonic.match(/.*ноябр.*/i)) return 10;
    else if (mnemonic.match(/.*декабр.*/i)) return 11;
    else return -1;
  }
}
