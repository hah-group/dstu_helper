import { TimeInterval, TimeIntervalParser } from '@dstu_helper/common';

describe('Time interval parser', () => {
  it('За минуту', () => {
    const result = TimeIntervalParser.Parse('За минуту');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60,
    });
  });

  it('За 15 минут', () => {
    const result = TimeIntervalParser.Parse('За 15 минут');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 15 * 60,
    });
  });

  it('За 90 минут', () => {
    const result = TimeIntervalParser.Parse('За 90 минут');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 90 * 60,
    });
  });

  it('За 120 минут', () => {
    const result = TimeIntervalParser.Parse('За 120 минут');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 120 * 60,
    });
  });

  it('За час', () => {
    const result = TimeIntervalParser.Parse('За час');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60,
    });
  });

  it('За 2 часа', () => {
    const result = TimeIntervalParser.Parse('За 2 часа');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 * 2,
    });
  });

  it('1ч 15м', () => {
    const result = TimeIntervalParser.Parse('1ч 15м');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 + 60 * 15,
    });
  });

  it('За 1ч 15м', () => {
    const result = TimeIntervalParser.Parse('За 1ч 15м');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 + 60 * 15,
    });
  });

  it('3', () => {
    const result = TimeIntervalParser.Parse('3');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 * 3,
    });
  });

  it('3ч', () => {
    const result = TimeIntervalParser.Parse('3ч');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 * 3,
    });
  });

  it('3 ч', () => {
    const result = TimeIntervalParser.Parse('3 ч');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 * 3,
    });
  });

  it('За 2', () => {
    const result = TimeIntervalParser.Parse('За 2');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 * 2,
    });
  });

  it('За 2ч', () => {
    const result = TimeIntervalParser.Parse('За 2ч');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 * 2,
    });
  });

  it('За 2 ч', () => {
    const result = TimeIntervalParser.Parse('За 2 ч');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 * 2,
    });
  });

  it('За 2 м', () => {
    const result = TimeIntervalParser.Parse('За 2 м');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 2,
    });
  });

  it('За 2м', () => {
    const result = TimeIntervalParser.Parse('За 2м');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 2,
    });
  });

  it('8 утра', () => {
    const result = TimeIntervalParser.Parse('8 утра');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '08:00',
    });
  });

  it('6 вечера', () => {
    const result = TimeIntervalParser.Parse('6 вечера');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '18:00',
    });
  });

  it('18 вечера', () => {
    const result = TimeIntervalParser.Parse('18 вечера');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '18:00',
    });
  });

  it('В 6 30 утра', () => {
    const result = TimeIntervalParser.Parse('В 6 30 утра');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '06:30',
    });
  });

  it('В 2 ночи', () => {
    const result = TimeIntervalParser.Parse('В 2 ночи');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '02:00',
    });
  });

  it('В 12 ночи', () => {
    const result = TimeIntervalParser.Parse('В 12 ночи');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '00:00',
    });
  });

  it('В 8', () => {
    const result = TimeIntervalParser.Parse('В 8');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '08:00',
    });
  });

  it('В 6', () => {
    const result = TimeIntervalParser.Parse('В 6');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '06:00',
    });
  });

  it('В 5', () => {
    const result = TimeIntervalParser.Parse('В 5');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '17:00',
    });
  });

  it('В 5 30 утра', () => {
    const result = TimeIntervalParser.Parse('В 5 30 утра');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '05:30',
    });
  });

  it('В 5 30 вечера', () => {
    const result = TimeIntervalParser.Parse('В 5 30 вечера');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '17:30',
    });
  });

  it('В 5 30 ночи', () => {
    const result = TimeIntervalParser.Parse('В 5 30 ночи');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '05:30',
    });
  });

  it('12:12', () => {
    const result = TimeIntervalParser.Parse('12:12');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '12:12',
    });
  });

  it('в 5:45', () => {
    const result = TimeIntervalParser.Parse('в 5:45');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '17:45',
    });
  });

  it('3 часа ночи', () => {
    const result = TimeIntervalParser.Parse('3 часа ночи');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '03:00',
    });
  });

  it('В 3 часа ночи', () => {
    const result = TimeIntervalParser.Parse('3 часа ночи');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '03:00',
    });
  });

  it('2 часа дня', () => {
    const result = TimeIntervalParser.Parse('2 часа дня');
    expect(result).toEqual<TimeInterval>({
      type: 'time',
      value: '14:00',
    });
  });

  it('За 1.5 часа', () => {
    const result = TimeIntervalParser.Parse('За 1.5 часа');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 + 60 * 30,
    });
  });

  it('За 1,5 часа', () => {
    const result = TimeIntervalParser.Parse('За 1,5 часа');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 + 60 * 30,
    });
  });

  it('1,5', () => {
    const result = TimeIntervalParser.Parse('1,5');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 + 60 * 30,
    });
  });

  it('1.5', () => {
    const result = TimeIntervalParser.Parse('1.5');
    expect(result).toEqual<TimeInterval>({
      type: 'interval',
      value: 60 * 60 + 60 * 30,
    });
  });
});
