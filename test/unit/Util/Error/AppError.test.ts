/**
 * @group unit
 */

import { AppError, LogicError, PanicError } from '@';

describe('AppError', () => {
  test('panic()', () => {
    const e = new AppError({ type: 'core.test.something', data: { a: 10 } });

    expect(() => e.panic()).toThrowError('core.test.something: {"a":10}');
  });

  describe('isErrorInstanceOf', () => {
    test('when is', () => {
      const error = new LogicError('test');
      const e = new AppError({ type: 'core.test.something', data: { a: 10 }, error });

      const current = e.isErrorInstanceOf(LogicError);

      expect(current).toBe(true);
    });

    test('when is not', () => {
      const error = new LogicError('test');
      const e:AppError<any, Error> = new AppError({ type: 'core.test.something', data: { a: 10 }, error });

      const current = e.isErrorInstanceOf(PanicError);

      expect(current).toBe(false);
    });
  });

  describe('tryCastErrorTo', () => {
    test('when is', () => {
      const error = new LogicError('test');
      const e = new AppError({ type: 'core.test.something', data: { a: 10 }, error });

      const current = e.tryCastErrorTo(LogicError);

      expect(current).toBe(e);
    });

    test('when is not', () => {
      const error = new LogicError('test');
      const e:AppError = new AppError({ type: 'core.test.something', data: { a: 10 }, error });

      const current = e.tryCastErrorTo(PanicError);

      expect(current).toBe(null);
    });
  });
});
