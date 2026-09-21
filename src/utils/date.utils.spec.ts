import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DateUtils } from './date.utils';

describe('parseSteamDate', () => {
  it('should handle August cropped', () => {
    const value = '7 Aug, 2007';
    const expected = '2007-08-07';
    const result = DateUtils.parseSteamDate(value);
    expect(result.toString()).toEqual(expected);
  });
});

describe('now', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2028, 3, 14, 10, 30, 25, 123));
  });

  it('mocks Temporal.Now correctly', () => {
    const now = DateUtils.now();
    expect(now).toEqual('2028-04-14T08:30:25Z');
  });
});
