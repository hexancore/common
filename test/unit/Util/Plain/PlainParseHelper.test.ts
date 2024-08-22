import { AppErrorCode, InvalidArrayElementsPlainParseIssue, InvalidHObjectPlainParseIssue, InvalidTypePlainParseIssue, PlainParseError, PlainParseHelper, type JsonObjectType } from '@';
import { TestDto } from '@test/helper/TestDto';
import path from 'node:path';

/**
 * @group unit
 */

describe(path.basename(__filename, '.test.ts'), () => {
  test('HObjectParseErr', () => {
    const issues = [new InvalidTypePlainParseIssue('number', 'string', 'field')];
    const current = PlainParseHelper.HObjectParseErr(TestDto, [new InvalidTypePlainParseIssue('number', 'string', 'field')]);

    expect(current.e.data).toEqual(new InvalidHObjectPlainParseIssue(TestDto.HOBJ_META, issues));
    expect(current.e.type).toBe(PlainParseError);
    expect(current.e.code).toBe(AppErrorCode.BAD_REQUEST);
  });

  describe('parseBigInt64()', () => {
    test('when valid should return parsed', () => {
      const plain = '1000';

      const current = PlainParseHelper.parseBigInt64(plain);

      expect(current).toBe(1000n);
    });

    test('when invalid should return issue', () => {
      const plain = 'bad1000';

      const current = PlainParseHelper.parseBigInt64(plain);

      expect(current).toEqual(new InvalidTypePlainParseIssue('bigint_string', 'string'));
    });
  });

  describe('parseNumber()', () => {
    test('when valid should return parsed', () => {
      const plain = 1000;

      const current = PlainParseHelper.parseNumber(plain);

      expect(current).toBe(1000);
    });

    test('when invalid should return issue', () => {
      const plain = 'bad1000';

      const current = PlainParseHelper.parseNumber(plain);

      expect(current).toEqual(new InvalidTypePlainParseIssue('number', 'string'));
    });
  });

  describe('parseBoolean()', () => {
    test('when valid should return parsed', () => {
      const plain = true;

      const current = PlainParseHelper.parseBoolean(plain);

      expect(current).toBe(true);
    });

    test('when invalid should return issue', () => {
      const plain = 1000;

      const current = PlainParseHelper.parseBoolean(plain);

      expect(current).toEqual(new InvalidTypePlainParseIssue('boolean', 'number'));
    });
  });

  describe('parseString()', () => {
    test('when valid should return parsed', () => {
      const plain = 'good';

      const current = PlainParseHelper.parseString(plain);

      expect(current).toBe('good');
    });

    test('when invalid should return issue', () => {
      const plain = 1000;

      const current = PlainParseHelper.parseString(plain);

      expect(current).toEqual(new InvalidTypePlainParseIssue('string', 'number'));
    });
  });

  describe('parseHObject()', () => {
    test('when valid should return parsed', () => {
      const plain: JsonObjectType<TestDto> = {
        bigIntField: '1000',
        numberField: 1000,
        numberArrayField: [1000],
        booleanField: true,
      };

      const current = PlainParseHelper.parseHObject(plain, TestDto);

      const expected = TestDto.cs({
        bigIntField: 1000n,
        booleanField: true,
        numberArrayField: [1000],
        numberField: 1000
      });
      expect(current).toEqual(expected);
    });

    test('when invalid should return issue', () => {
      const plain = 1000;

      const current = PlainParseHelper.parseHObject(plain, TestDto);

      expect(current).toEqual(new InvalidHObjectPlainParseIssue(TestDto.HOBJ_META, [
        new InvalidTypePlainParseIssue('object', 'number')
      ]));
    });
  });


  describe('parseHObjectArray()', () => {
    test('when valid should return parsed', () => {
      const plain: JsonObjectType<TestDto> = {
        bigIntField: '1000',
        numberField: 1000,
        numberArrayField: [1000],
        booleanField: true,
      };

      const current = PlainParseHelper.parseHObjectArray([plain], TestDto);

      const expected = TestDto.cs({
        bigIntField: 1000n,
        booleanField: true,
        numberArrayField: [1000],
        numberField: 1000
      });
      expect(current).toEqual([expected]);
    });

    test('when invalid should return issue', () => {
      const plain = 1000;

      const current = PlainParseHelper.parseHObjectArray([plain], TestDto);

      const expected = new InvalidArrayElementsPlainParseIssue([
        new InvalidHObjectPlainParseIssue(TestDto.HOBJ_META, [
          new InvalidTypePlainParseIssue('object', 'number')
        ], '0')
      ]);
      expect(current).toEqual(expected);
    });
  });


});
