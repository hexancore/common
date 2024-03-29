/**
 * @group unit
 */

import { DateTime } from '@';
import { Duration, Period } from '@js-joda/core';

describe('DateTime', () => {
  describe("c", () => {
    test('when input is Date', () => {
      const raw = new Date("2024-01-01 10:30:30");

      const result = DateTime.c(raw);

      expect(result.v.formatDateTime()).toBe(raw.toISOString().replace(/\..+/, ""));
    });

    test.each([
      {name: "dateTimeIso", raw: "2024-01-01 10:30:30.300Z", expected: "2024-01-01T10:30:30"},
      {name: "dateTimeSpace", raw: "2024-01-01 10:30:30", expected: "2024-01-01T10:30:30"},
      {name: "dateTimeTSeparator", raw: "2024-01-01T10:30:30", expected: "2024-01-01T10:30:30"},
      {name: "onlyDate", raw: "2024-01-01", expected: "2024-01-01T00:00:00"}
    ])('when input is string($name)', (data) => {

      const result = DateTime.c(data.raw);

      expect(result.isSuccess()).toBe(true);
      expect(result.v.formatDateTime()).toBe(data.expected);
    });
  });

  describe("cs", () => {
    test('when input is Date', () => {
      const raw = new Date("2024-01-01 10:30:30");

      const result = DateTime.cs(raw);

      expect(result.formatDateTime()).toBe(raw.toISOString().replace(/\..+/, ""));
    });

    test.each([
      {name: "dateTimeIso", raw: "2024-01-01 10:30:30.300Z", expected: "2024-01-01T10:30:30"},
      {name: "dateTimeSpace", raw: "2024-01-01 10:30:30", expected: "2024-01-01T10:30:30"},
      {name: "dateTimeTSeparator", raw: "2024-01-01T10:30:30", expected: "2024-01-01T10:30:30"},
      {name: "onlyDate", raw: "2024-01-01", expected: "2024-01-01T00:00:00"}
    ])('when input is string($name)', (data) => {

      const result = DateTime.c(data.raw);

      expect(result.isSuccess()).toBe(true);
      expect(result.v.formatDateTime()).toBe(data.expected);
    });
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
    const date = DateTime.cs('2023-10-01 08:50:00');

    const current = date.formatRfc1123();

    expect(current).toBe('Sun, 01 Oct 2023 08:50:00 GMT');
  });
});
