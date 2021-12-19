import { TimeRelativeProcessor } from './time-relative.processor';
import * as moment from 'moment';

describe('Time relative processor', () => {
  it('now - before first lesson (struct)', () => {
    const result = TimeRelativeProcessor.now(true, moment('04:35+3', 'HH:mm'));
    expect(result).toBe(undefined);
  });

  it('now - before first lesson', () => {
    const result = TimeRelativeProcessor.now(false, moment('04:35+3', 'HH:mm'));
    expect(result).toBe(1);
  });

  it('now - at first lesson (struct)', () => {
    const result = TimeRelativeProcessor.now(true, moment('08:35+3', 'HH:mm'));
    expect(result).toBe(1);
  });

  it('now - at first lesson', () => {
    const result = TimeRelativeProcessor.now(false, moment('08:35+3', 'HH:mm'));
    expect(result).toBe(1);
  });

  it('now - at break between 1 and 2 (struct)', () => {
    const result = TimeRelativeProcessor.now(true, moment('10:06+3', 'HH:mm'));
    expect(result).toBe(undefined);
  });

  it('now - at break between 1 and 2', () => {
    const result = TimeRelativeProcessor.now(false, moment('10:06+3', 'HH:mm'));
    expect(result).toBe(2);
  });

  it('now - at last lesson (struct)', () => {
    const result = TimeRelativeProcessor.now(true, moment('19:40+3', 'HH:mm'));
    expect(result).toBe(7);
  });

  it('now - at last lesson', () => {
    const result = TimeRelativeProcessor.now(false, moment('19:40+3', 'HH:mm'));
    expect(result).toBe(7);
  });

  it('now - after last lesson (struct)', () => {
    const result = TimeRelativeProcessor.now(true, moment('21:06+3', 'HH:mm'));
    expect(result).toBe(undefined);
  });

  it('now - after all lessons', () => {
    const result = TimeRelativeProcessor.now(false, moment('21:06+3', 'HH:mm'));
    expect(result).toBe(undefined);
  });

  //--------------------------------

  it('next - before first lesson', () => {
    const result = TimeRelativeProcessor.next(moment('04:35+3', 'HH:mm'));
    expect(result).toBe(2);
  });

  it('next - at first lesson', () => {
    const result = TimeRelativeProcessor.next(moment('08:35+3', 'HH:mm'));
    expect(result).toBe(2);
  });

  it('next - at break between 1 and 2', () => {
    const result = TimeRelativeProcessor.next(moment('10:06+3', 'HH:mm'));
    expect(result).toBe(2);
  });

  it('next - at last lesson', () => {
    const result = TimeRelativeProcessor.next(moment('19:40+3', 'HH:mm'));
    expect(result).toBe(undefined);
  });

  it('next - after all lessons', () => {
    const result = TimeRelativeProcessor.next(moment('21:06+3', 'HH:mm'));
    expect(result).toBe(undefined);
  });
});
