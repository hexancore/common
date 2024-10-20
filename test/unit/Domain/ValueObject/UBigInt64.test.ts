/**
 * @group unit/core
 */

import { PlainParseError, UInt64 } from '../../../../src';

class CustomUBigInt extends UInt64 {
  public customMethod() {
    return 'test';
  }
}

describe('UBigIntValue', () => {
  test('create from string', () => {
    const result = UInt64.parse('10');
    expect(result.v.v).toBe(10n);
  });

  test('create when invalid string raw value', () => {
    const result = UInt64.parse('-10');
    expect(result.isError()).toBe(true);

    expect(result.e.type).toEqual(PlainParseError);
  });

  test('create from bigint', () => {
    const result = UInt64.parse(10n);
    expect(result.v.v).toBe(10n);
  });

  test('create custom', () => {
    const result = CustomUBigInt.parse(10n);
    expect(result.v).toBeInstanceOf(CustomUBigInt);
    expect(result.v.v).toBe(10n);
  });

  test('Json.string', () => {
    const vo = CustomUBigInt.cs(10n);
    const current = JSON.stringify(vo);
    expect(current).toEqual('"10"');
  });
});
