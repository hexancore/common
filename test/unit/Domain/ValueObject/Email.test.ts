/**
 * @group unit
 */

import { Email, JsonSchemaFactory, PlainParseError } from '@';

describe('Email', () => {
  test('parse', () => {
    const result = Email.parse('test@test.com');
    expect(result.isSuccess()).toBe(true);
    expect(result.v.v).toEqual('test@test.com');
  });
  test('parse when invalid raw value', () => {
    const result = Email.parse('test@test');
    expect(result.isError()).toBe(true);

    expect(result.e.type).toEqual(PlainParseError);
  });

  test('JSON_SCHEMA', () => {
    const current = Email.JSON_SCHEMA;
    expect(current).toEqual(JsonSchemaFactory.String({ format: "email" }));
  });

  test('get local', () => {
    const result = Email.parse('test@test.com');
    expect(result.v.local).toEqual('test');
  });
  test('get domain', () => {
    const result = Email.parse('test@test.com');
    expect(result.v.domain).toEqual('test.com');
  });
});
