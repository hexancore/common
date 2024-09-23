/**
 * @group unit/core
 */

import { PlainParseError } from "@";
import { UIntValue } from '@/Domain/ValueObject/UIntValue';

describe('UIntValue', () => {
  test('create', () => {
    const result = UIntValue.parse(10);
    expect(result.v.v).toBe(10);
  });

  test('create when invalid raw value', () => {
    const result = UIntValue.parse(-10);
    expect(result.isError()).toBe(true);

    expect(result.e.type).toEqual(PlainParseError);
  });
});
