/**
 * @group unit/core
 */

import { PlainParseError } from "@";
import { UInt } from '@/Domain/ValueObject/UInt';

describe('UIntValue', () => {
  test('create', () => {
    const result = UInt.parse(10);
    expect(result.v.v).toBe(10);
  });

  test('create when invalid raw value', () => {
    const result = UInt.parse(-10);
    expect(result.isError()).toBe(true);

    expect(result.e.type).toEqual(PlainParseError);
  });
});
