import { DateTime, Time } from '@dstu_helper/common';

import { TimeOrderProcessor } from './time-order.processor';

describe('Time relative processor', () => {
  let globalTime: DateTime;
  beforeAll(() => {
    globalTime = Time.get();
  });

  it('now - before first lesson (struct)', () => {
    const result = TimeOrderProcessor.now(true, globalTime.hour(4).minute(35));
    expect(result).toBe(undefined);
  });

  it('now - before first lesson', () => {
    const result = TimeOrderProcessor.now(false, globalTime.hour(4).minute(35));
    expect(result).toBe(1);
  });

  it('now - at first lesson (struct)', () => {
    const result = TimeOrderProcessor.now(true, globalTime.hour(8).minute(35));
    expect(result).toBe(1);
  });

  it('now - at first lesson', () => {
    const result = TimeOrderProcessor.now(false, globalTime.hour(8).minute(35));
    expect(result).toBe(1);
  });

  it('now - at break between 1 and 2 (struct)', () => {
    const result = TimeOrderProcessor.now(true, globalTime.hour(10).minute(6));
    expect(result).toBe(undefined);
  });

  it('now - at break between 1 and 2', () => {
    const result = TimeOrderProcessor.now(false, globalTime.hour(10).minute(6));
    expect(result).toBe(2);
  });

  it('now - at last lesson (struct)', () => {
    const result = TimeOrderProcessor.now(true, globalTime.hour(19).minute(40));
    expect(result).toBe(7);
  });

  it('now - at last lesson', () => {
    const result = TimeOrderProcessor.now(false, globalTime.hour(19).minute(40));
    expect(result).toBe(7);
  });

  it('now - after last lesson (struct)', () => {
    const result = TimeOrderProcessor.now(true, globalTime.hour(21).minute(6));
    expect(result).toBe(undefined);
  });

  it('now - after all lessons', () => {
    const result = TimeOrderProcessor.now(false, globalTime.hour(21).minute(6));
    expect(result).toBe(undefined);
  });

  it('now - at third lesson', () => {
    const result = TimeOrderProcessor.now(false, globalTime.hour(13).minute(28));
    expect(result).toBe(3);
  });

  //--------------------------------

  it('next - before first lesson', () => {
    const result = TimeOrderProcessor.next(globalTime.hour(4).minute(35));
    expect(result).toBe(2);
  });

  it('next - at first lesson', () => {
    const result = TimeOrderProcessor.next(globalTime.hour(8).minute(35));
    expect(result).toBe(2);
  });

  it('next - at break between 1 and 2', () => {
    const result = TimeOrderProcessor.next(globalTime.hour(10).minute(6));
    expect(result).toBe(2);
  });

  it('next - at last lesson', () => {
    const result = TimeOrderProcessor.next(globalTime.hour(19).minute(40));
    expect(result).toBe(undefined);
  });

  it('next - after all lessons', () => {
    const result = TimeOrderProcessor.next(globalTime.hour(21).minute(6));
    expect(result).toBe(undefined);
  });

  it('next - at third lesson', () => {
    const result = TimeOrderProcessor.next(globalTime.hour(13).minute(28));
    expect(result).toBe(4);
  });
});
