import { Moment } from '@dstu_helper/common';

import { DateParser } from './date.parser';

describe('Date parser', () => {
  it('сегодня', () => {
    const result = DateParser.Parse('сегодня', Moment('2021-12-12 10:00'));
    expect(result.isSame(Moment('2021-12-12'), 'd')).toBe(true);
  });

  it('сегодня 2:20', () => {
    const result = DateParser.Parse('сегодня', Moment('2021-12-12 2:20'));
    expect(result.isSame(Moment('2021-12-12'), 'd')).toBe(true);
  });

  it('завтра', () => {
    const result = DateParser.Parse('завтра', Moment('2021-12-12 10:00'));
    expect(result.isSame(Moment('2021-12-13'), 'd')).toBe(true);
  });

  it('завтра 2:20', () => {
    const result = DateParser.Parse('завтра', Moment('2021-12-12 2:20'));
    expect(result.isSame(Moment('2021-12-12'), 'd')).toBe(true);
  });

  it('послезавтра', () => {
    const result = DateParser.Parse('послезавтра', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-14'), 'd')).toBe(true);
  });

  it('после после завтра', () => {
    const result = DateParser.Parse('после после завтра', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-15'), 'd')).toBe(true);
  });

  it('после поза завтра', () => {
    const result = DateParser.Parse('после поза завтра', Moment('2021-12-12 10:00'));
    expect(result.isSame(Moment('2021-12-13'), 'd')).toBe(true);
  });

  it('поза поза после завтра', () => {
    const result = DateParser.Parse('поза поза после завтра', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-12'), 'd')).toBe(true);
  });

  it('среду', () => {
    const result = DateParser.Parse('среду', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-15'), 'd')).toBe(true);
  });

  it('пт', () => {
    const result = DateParser.Parse('пт', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-17'), 'd')).toBe(true);
  });

  it('вс', () => {
    const result = DateParser.Parse('вс', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-19'), 'd')).toBe(true);
  });

  it('15 декабря', () => {
    const result = DateParser.Parse('15 декабря', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-15'), 'd')).toBe(true);
  });

  it('11 число', () => {
    const result = DateParser.Parse('11 число', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-11'), 'd')).toBe(true);
  });

  it('15 января', () => {
    const result = DateParser.Parse('15 января', Moment('2021-12-12'));
    expect(result.isSame(Moment('2022-01-15'), 'd')).toBe(true);
  });

  it('15 число', () => {
    const result = DateParser.Parse('15 число', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-15'), 'd')).toBe(true);
  });

  it('15 02', () => {
    const result = DateParser.Parse('15 02', Moment('2021-12-12'));
    expect(result.isSame(Moment('2022-02-15'), 'd')).toBe(true);
  });

  it('10 декабря', () => {
    const result = DateParser.Parse('10 декабря', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-10'), 'd')).toBe(true);
  });

  it('10 ноября', () => {
    const result = DateParser.Parse('10 ноября', Moment('2021-12-12'));
    expect(result.isSame(Moment('2022-11-10'), 'd')).toBe(true);
  });

  it('10 число', () => {
    const result = DateParser.Parse('10 число', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-10'), 'd')).toBe(true);
  });

  it('21 декабря 22', () => {
    const result = DateParser.Parse('21 декабря 22', Moment('2021-12-12'));
    expect(result.isSame(Moment('2022-12-21'), 'd')).toBe(true);
  });

  it('21 декабря 2022', () => {
    const result = DateParser.Parse('21 декабря 2022', Moment('2021-12-12'));
    expect(result.isSame(Moment('2022-12-21'), 'd')).toBe(true);
  });

  it('21.01', () => {
    const result = DateParser.Parse('21.01', Moment('2021-12-12'));
    expect(result.isSame(Moment('2022-01-21'), 'd')).toBe(true);
  });

  it('21.01.2024', () => {
    const result = DateParser.Parse('21.01.2024', Moment('2021-12-12'));
    expect(result.isSame(Moment('2024-01-21'), 'd')).toBe(true);
  });

  it('вчера', () => {
    const result = DateParser.Parse('вчера', Moment('2021-12-12 10:00'));
    expect(result.isSame(Moment('2021-12-11'), 'd')).toBe(true);
  });

  it('вчера 2:20', () => {
    const result = DateParser.Parse('вчера', Moment('2021-12-12 2:20'));
    expect(result.isSame(Moment('2021-12-10'), 'd')).toBe(true);
  });

  it('позавчера', () => {
    const result = DateParser.Parse('позавчера', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-10'), 'd')).toBe(true);
  });

  it('позапозапозавчера', () => {
    const result = DateParser.Parse('позапозапозавчера', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-08'), 'd')).toBe(true);
  });

  it('поза позавчера', () => {
    const result = DateParser.Parse('поза позавчера', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-09'), 'd')).toBe(true);
  });

  it('поза поза поза вчера', () => {
    const result = DateParser.Parse('поза поза поза вчера', Moment('2021-12-12'));
    expect(result.isSame(Moment('2021-12-08'), 'd')).toBe(true);
  });

  it('32 декабря', () => {
    const result = DateParser.Parse('32 декабря', Moment('2021-12-12'));
    expect(result.isSame(Moment('2022-01-01'), 'd')).toBe(true);
  });
});
