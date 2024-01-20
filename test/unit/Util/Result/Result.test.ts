/**
 * @group unit
 */

import { AppError, ERR, LogicError, NeverError, OK, OKA, R, Result } from '@';
import { TestErrors } from '@test/helper/TestErrors';

class TestClass {
  private method1Calls: number;
  private method2Calls: number;

  public constructor() {
    this.method1Calls = this.method2Calls;
  }

  public methodWithOnlyValueAndVoidReturn(): void {}

  public methodWithOnlyValue(v: number): number {
    return this.method1Calls++;
  }

  public method2(): R<number, 'test_error1' | 'test_error2'> {
    return OK(this.method2Calls++);
  }

  public methodNeverError(): R<number, NeverError> {
    return OK(10).onOk((v) => v + 10);
  }

  /**
   * Checks onOk -> onErr chain propagation
   */
  public methodOnOkOnErr(): R<number, TestErrors<'error_1'>> {
    const start = ERR<string, TestErrors<'error_start'>>(TestErrors.error_start);
    const onOk: R<number, TestErrors<'error_start'>> = start.onOk((v) => 10);
    const onErr: R<number, TestErrors<'error_1'>> = onOk.onErr((e) => ERR(TestErrors.error_1));
    return onErr;
  }

  /**
   * Checks onErr -> onOk chain propagation
   */
  public methodOnErrOnOk(): R<number, TestErrors<'error_1'>> {
    const start = ERR<number, TestErrors<'error_start'>>(TestErrors.error_start);
    const onErr: R<number, TestErrors<'error_1'>> = start.onErr((e) => ERR(TestErrors.error_1));
    const onOk: R<number, TestErrors<'error_1'>> = onErr.onOk((v) => 10);
    return onOk;
  }

  /**
   * Checks only onOk chain propagation
   */
  public methodOnlyOk(): R<number, TestErrors<'error_start'>> {
    const start = ERR(TestErrors.error_start);
    const onOk: R<number, TestErrors<'error_start'>> = start.onOk((v) => 10);
    return onOk;
  }

  /**
   * Checks only onErr chain propagation
   */
  public methodOnlyErr(): R<string | number, TestErrors<'error_1'>> {
    const start = ERR<number, TestErrors<'error_start'>>(TestErrors.error_start);
    // eslint-disable-next-line no-constant-condition
    const onErr: R<string | number, TestErrors<'error_1'>> = start.onErr((e) => (false ? ('test' as string) : ERR(TestErrors.error_1)));
    return onErr;
  }
}

describe('Result', () => {
  test('OK()', () => {
    const current = OK('test_data');

    expect(current.isSuccess()).toBeTruthy();
    expect(current.v).toBe('test_data');
    expect(() => current.e).toThrow("Can't use e() on SuccessResult");
  });

  test('ERR()', () => {
    const current = ERR<boolean>('test_type', 400, 'test_data');

    expect(current.isError()).toBeTruthy();
    expect(current.e).toBeInstanceOf(AppError);
    expect(current.e.type).toBe('test_type');
    expect(current.e.code).toBe(400);
    expect(current.e.data).toBe('test_data');
    expect(() => current.v).toThrow("Can't use v() on ErrorResult: test_type");
  });

  describe('onOk', () => {
    test('when result is ok, should execute function and return result with value from function', () => {
      const result = OK('test_data');

      const current = result.onOk((v: string) => OK(v.toUpperCase()));

      expect(current.isSuccess()).toBeTruthy();
      expect(current.v).toBe('TEST_DATA');
    });

    test('when result is ok and return from function is not instanceof Result, should wrap with result', () => {
      const result = OK('test_data');

      const current = result.onOk((v: string) => v.toUpperCase());

      expect(current.isSuccess()).toBeTruthy();
      expect(current.v).toBe('TEST_DATA');
    });

    test('when result is ok and return from function is AsyncResult, should return it', async () => {
      const result = OK('test_data');

      const current = await result.onOk((v: string) => OKA(100));

      expect(current.isSuccess()).toBeTruthy();
      expect(current.v).toBe(100);
    });

    test('when result is error, should not execute function and return this result', () => {
      const result = ERR<string>('test_type', 400, 'test_data');
      const fn: (v: string) => number = jest.fn();

      const current = result.onOk(fn);

      expect(fn).not.toBeCalled();
      expect(current).toBe(result);
      expect(current.e.type === 'test_type').toBeTruthy();
    });
  });

  describe('onErr', () => {
    test('when result is error, should execute function and return result with value from function', () => {
      const result = ERR('test_error');

      const current = result.onErr((e: AppError) => 100);

      expect(current.isSuccess()).toBeTruthy();
      expect(current.v).toBe(100);
    });

    test('when result is success, should not execute function and return this', () => {
      const result = OK('test_error');

      const current = result.onErr((e: AppError) => 100);

      expect(current).toBe(result);
    });

    test('when result is error and fn returns AsyncResult, should execute function and return result from function', async () => {
      const result = ERR('test_error');

      const current = await result.onErr((e: AppError) => OKA(100));

      expect(current.isSuccess()).toBeTruthy();
      expect(current.v).toBe(100);
    });

    test('when result is error and selected error type handler, should execute handler from event type and return result from function', () => {
      const result = ERR<any, 'test_error' | 'test_error2'>('test_error');

      const current = result.onErr('test_error', (e) => OK(100));

      expect(current.isSuccess()).toBeTruthy();
      expect(current.v).toBe(100);
    });

    test('when result is error and selected error type handler and not defined for error type, should return self', () => {
      const result = ERR<boolean, 'test_error' | 'test_error2'>('test_error2');

      const fn: (v: string) => number = jest.fn();

      const current = result.onErr('test_error', (e: AppError) => OK(100));

      expect(fn).not.toBeCalled();
      expect(current).toBe(result);
      expect(current.e.type === 'test_error2').toBeTruthy();
    });
  });

  describe('Chains', () => {
    test('onOk->onErr', () => {
      const result = OK<string, TestErrors<'error_start'>>('test_data');

      const current = result
        .onOk(() => {})
        .onErr((v: AppError<TestErrors<'error_start'>, LogicError>): boolean | R<boolean, TestErrors<'error_1'>> =>
          // eslint-disable-next-line no-constant-condition
          true ? true : ERR(TestErrors.error_1),
        );

      expect(current.v).toBeUndefined();
    });

    test('onErr->onOk', () => {
      const result = OK<string, 'start_error'>('test_data');

      const current = result
        .onErr((v) => {
          const b: number = 10;
          // eslint-disable-next-line no-constant-condition
          return true ? b : ERR(TestErrors.error_1);
        })
        .onOk((v: number | string) => v + '_last');

      expect(current.v).toBe('test_data_last');
    });
  });

  describe('allToFirstError()', () => {
    test('when all success', () => {
      const results = [OK(1), OK(2), OK(3)];
      const current = Result.allToFirstError(results);

      expect(current).toEqual(OK([1, 2, 3]));
    });

    test('when one error', () => {
      const error = ERR<boolean>('test_error');
      const current = Result.allToFirstError([OK(1), error, OK(3)]);
      expect(current).toEqual(error);
    });
  });

  describe('all()', () => {
    test('when all success', () => {
      const results = {
        result_1: OK(10),
        result_2: OK('test'),
      };
      const current = Result.all(results, 'test');

      expect(current).toEqual(OK({ result_1: 10, result_2: 'test' }));
    });

    test('when one error', () => {
      const results = {
        result_1: OK(10),
        result_2: ERR('test'),
      };
      const current = Result.all(results, 'test_main');
      expect(current).toMatchAppError({ type: 'test_main', code: 500, data: { result_1: null, result_2: results.result_2.e } });
    });
  });
});
