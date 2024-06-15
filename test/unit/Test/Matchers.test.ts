/**
 * @group unit
 */

import { ERR, OK, stripAnsiColors } from '@';

describe('Matchers', () => {
  describe('toMatchSuccessResult', () => {
    test('When success result and same value', () => {
      const current = OK(10);

      expect(current).toMatchSuccessResult(10);
    });

    test('When success result and other value, the throw', () => {
      expect.assertions(2);

      try {
        const current = OK(10);
        expect(current).toMatchSuccessResult('test');
      } catch (e) {
        const expected = [
          'Expected result value to be:',
          ' "test"',
          'Received:',
          ' 10',
          '',
          '  Comparing two different types of values. Expected string but received number.'
        ].join('\n');
        expect(stripAnsiColors((e as Error).message)).toEqual(expected);
      }
    });

    test('When success result and negation, then throw', () => {
      expect.assertions(2);

      try {
        const current = OK(10);
        expect(current).not.toMatchSuccessResult(10);
      } catch (e) {
        const expected = ['Expected result value to be not:', ' 10', 'Received:', ' 10'].join('\n');
        expect(stripAnsiColors((e as Error).message)).toEqual(expected);
      }
    });

    test('When error result, then throw', () => {
      expect.assertions(2);
      const current = ERR('test.error');
      try {

        expect(current).toMatchSuccessResult(10);
      } catch (e) {
        const expected = [
          'Expected result value to be:',
          ' 10',
          'Received error:',
          ` ${JSON.stringify(current.e, undefined, 2)}`,
        ].join('\n');
        expect(stripAnsiColors((e as Error).message)).toEqual(expected);
      }
    });

    test('When error result and negation', () => {
      const current = ERR('test.error');

      expect(current).not.toMatchSuccessResult(10);
    });
  });
});
