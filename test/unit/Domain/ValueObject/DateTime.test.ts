/**
 * @group unit
 */

import { DateTime, AppError } from '@';
import { Duration, Period } from '@js-joda/core';

describe('DateTime', () => {
  test('c() when date', () => {
    const date = new Date();
    const nowTimestamp = date.getTime();
    const result = DateTime.c(date);
    date.setTime(nowTimestamp + 60 * 60 * 1000);

    expect(result.v.t).toBe(Math.trunc(nowTimestamp / 1000));
  });

  test('fromTimestamp', () => {
    const result = DateTime.fromTimestamp(1652651144);
    expect(result.v.t).toBe(1652651144);
  });

  test('fromTimestamp when invalid raw value', () => {
    const result = DateTime.fromTimestamp(-10);
    expect(result.isError()).toBe(true);

    expect(result.e.type).toEqual('core.domain.value_object.date_time.invalid_raw_value');
    expect(result.e.data).toEqual({ msg: 'invalid timestamp', raw: -10 });
  });

  test('plus()', () => {
    const current = DateTime.cs('2023-01-01T10:50:00').plus(Period.ofDays(2)).plus(Duration.ofHours(2));
    expect(current.toString()).toBe('2023-01-03T12:50:00');
  });

  test('minus()', () => {
    const current = DateTime.cs('2023-10-01T10:50:00').minus(Period.ofDays(2)).minus(Duration.ofHours(2));
    expect(current.toString()).toBe('2023-09-29T08:50:00');
  });

  test('formatRfc1123', () => {
    const date = DateTime.cs('2023-10-01T08:50:00');

    const current = date.formatRfc1123();

    expect(current).toBe('Sun, 01 Oct 2023 08:50:00 GMT');
  });
});
