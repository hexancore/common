/**
 * @group unit
 */

import { AR, ARW, AppError, ERR, ERRA, NeverError, OK, OKA, R, StdErrors } from '@';
import { TestErrSuccess1, TestErrors, TestOk1, TestStartOk } from '@test/helper/TestErrors';

class TestBindClass {
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

  public methodNeverError(): AR<number, NeverError> {
    return OKA(10).onOk((v) => v + 10);
  }

  /**
   * Checks onOk -> onErr chain propagation
   */
  public methodOnOkOnErr(): AR<number, TestErrors<'error_1'>> {
    const start = ERRA<string, TestErrors<'error_start'>>(TestErrors.error_start);
    const onOk: AR<number, TestErrors<'error_start'>> = start.onOk((v) => 10);
    const onErr: AR<number, TestErrors<'error_1'>> = onOk.onErr((e) => ERR(TestErrors.error_1));
    return onErr;
  }

  /**
   * Checks onErr -> onOk chain propagation
   */
  public methodOnErrOnOk(): AR<number, TestErrors<'error_1'>> {
    const start = ERRA<number, TestErrors<'error_start'>>(TestErrors.error_start);
    const onErr: AR<number, TestErrors<'error_1'>> = start.onErr((e) => ERR(TestErrors.error_1));
    const onOk: AR<number, TestErrors<'error_1'>> = onErr.onOk((v) => 10);
    return onOk;
  }

  /**
   * Checks only onOk chain propagation
   */
  public methodOnlyOk(): AR<number, TestErrors<'error_start'>> {
    const start = ERRA(TestErrors.error_start);
    const onOk: AR<number, TestErrors<'error_start'>> = start.onOk((v) => 10);
    return onOk;
  }

  /**
   * Checks only onErr chain propagation
   */
  public methodOnlyErr(): AR<string | number, TestErrors<'error_1'>> {
    const start = ERRA<number, TestErrors<'error_start'>>(TestErrors.error_start);
    // eslint-disable-next-line no-constant-condition
    const onErr: AR<string | number, TestErrors<'error_1'>> = start.onErr((e) => (false ? ('test' as string) : ERR(TestErrors.error_1)));
    return onErr;
  }
}

describe('AsyncResult', () => {
  describe('onOk', () => {
    test.each([
      ['value', 'new_data'],
      ['Result', OK('new_data')],
      ['AsyncResult', OKA('new_data')],
    ])('when result is success and fn returns %s', async (_returnValueType, fnReturn) => {
      const result = OKA('test_data');

      const current = await result.onOk(() => {
        return fnReturn;
      });

      expect(current.isSuccess()).toBeTruthy();
      expect(current.v).toBe('new_data');
    });

    test('when result is success and fn returns promise with success result', async () => {
      const result = OKA('test_data');

      const current = await result.onOk(async () => {
        return OK('new_data');
      });

      expect(current.isSuccess()).toBeTruthy();
      expect(current.v).toBe('new_data');
    });

    test('when result is success and fn returns promise with throw', async () => {
      const result = OKA('test_data');

      const current = await result.onOk(async () => {
        throw new Error('test_error');
      });

      expect(current).toMatchAppError({
        type: StdErrors.internal,
        message: 'test_error',
        code: 500,
        error: expect.objectContaining({ message: 'test_error' }),
      });
    });

    test('when fn return error result, should return it', async () => {
      const result = OKA('test_data');

      const current = await result.onOk(() => {
        // eslint-disable-next-line no-constant-condition
        if (false) {
          return OK(1);
        }
        return ERR('test_error');
      });

      expect(current.isError()).toBeTruthy();
      expect(current.e.type === 'test_error').toBeTruthy();
    });

    test('when result is error, should not execute function and return this result', async () => {
      const result = ERRA<string>('test_type', 400, 'test_data');
      const fn: (v: string) => number = jest.fn();

      const current = await result.onOk(fn);

      expect(fn).not.toBeCalled();
      expect(current.e.type === 'test_type').toBeTruthy();
    });
  });

  describe('onErr', () => {
    test.each([
      ['value', 'new_data'],
      ['Result', OK('new_data')],
      ['AsyncResult', OKA('new_data')],
    ])('when result is error and fn returns %s', async (_returnValueType, fnReturn) => {
      const result = ERRA('test_data');

      const current = await result.onErr(() => {
        return fnReturn;
      });

      expect(current.isSuccess()).toBeTruthy();
      expect(current.v).toBe('new_data');
    });

    test.each([
      ['value', 'new_data'],
      ['Result', OK('new_data')],
    ])('when result is error and fn returns promise %s', async (_returnValueType, fnReturn) => {
      const result = ERRA('test_data');

      const current = await result.onErr(async () => {
        return fnReturn;
      });

      expect(current.isSuccess()).toBeTruthy();
      expect(current.v).toBe('new_data');
    });

    test('when result is success, should not execute function and return this result', async () => {
      const result = OKA<string, TestErrors<'error_start'>>('test');
      const fn: (e) => number = jest.fn();

      const current = await result.onErr(fn);

      expect(fn).not.toBeCalled();
      expect(current.v === 'test').toBeTruthy();
    });

    test('when result is error and selected error type handler, should execute handler from event type and return result from function', async () => {
      const result = ERRA<any, 'test_error' | 'test_error2'>('test_error');

      const current = await result.onErr('test_error', (e) => OK(100));

      expect(current.isSuccess()).toBeTruthy();
      expect(current.v).toBe(100);
    });

    test('when result is error and selected error type handler and not defined for error type, should return self', async () => {
      const result = ERRA<TestStartOk, 'test_error' | 'test_error2'>('test_error2');

      const fn: (v: string) => number = jest.fn();

      const current = await result.onErr('test_error', (e) => OK(100));

      expect(fn).not.toBeCalled();
      expect(current.e.type === 'test_error2').toBeTruthy();
    });
  });

  describe('Chains', () => {
    test('onOk -> onErr', async () => {
      const result = OKA<TestStartOk, TestErrors<'error_start'>>(new TestStartOk());

      const current = await result
        .onOk((v: TestStartOk) => {
          // eslint-disable-next-line no-constant-condition
          return true ? OK(new TestOk1()) : ERR(TestErrors.error_1);
        })
        .onErr((v: AppError<TestErrors<'error_start'> | TestErrors<'error_1'>>) => new TestErrSuccess1());

      expect(current.v).toBeInstanceOf(TestOk1);
    });

    test('onOk -> onOk', async () => {
      const result = OKA<TestStartOk, TestErrors<'error_start'>>(new TestStartOk());

      const current = await result
        .onOk((v: TestStartOk) => {
          return 1;
        })
        .onOk((v: number) => {
          return v + 1;
        });

      expect(current.v).toBe(2);
    });

    test('onOk()=>void -> onErr', async () => {
      const result = OKA<TestStartOk, TestErrors<'error_start'>>(new TestStartOk());

      const current = await result
        .onOk((v: TestStartOk) => {})
        .onErr((v: AppError<TestErrors<'error_start'> | TestErrors<'error_1'>>) => new TestErrSuccess1());

      expect(current.v).toBeUndefined();
    });

    test('onErr -> onOk', async () => {
      const result = OKA<TestStartOk, TestErrors<'error_start'>>(new TestStartOk());

      const current = await result
        .onErr((v: AppError<TestErrors<'error_start'>>) => new TestErrSuccess1())
        .onOk((v: TestStartOk) => {
          // eslint-disable-next-line no-constant-condition
          return true ? OK(new TestOk1()) : ERR(TestErrors.error_1);
        });

      expect(current.v).toBeInstanceOf(TestOk1);
    });
  });

  describe('onOkThis', () => {
    test('', async () => {
      const result = OKA('test');
      const obj = new TestBindClass();
      const current = await result
        .bind(obj)
        .onOkThis('method2')
        .onErr(() => true);
    });
  });

  describe('ARW', () => {
    test('when promise', async () => {
      const result = ARW(Promise.resolve('test'));

      const current = await result;

      expect(current).toMatchSuccessResult('test');
    });

    test('when function returns promise', async () => {
      const result = ARW(async () => 'test');

      const current = await result;

      expect(current).toMatchSuccessResult('test');
    });
  });

  test('onEachAsArray() when return Result', async () => {
    const current: R<number[]> = await OKA([1, 2, 3]).onEachAsArray((v) => {
      return OK(v);
    });

    expect(current.isSuccess()).toBeTruthy();
    expect(current).toEqual(OK([1, 2, 3]));
  });

  test('onEachAsArray() when return AsyncResult', async () => {
    const current: R<number[]> = await OKA([1, 2, 3]).onEachAsArray((v) => {
      return OKA(v);
    });

    expect(current.isSuccess()).toBeTruthy();
    expect(current).toEqual(OK([1, 2, 3]));
  });

  test('onEachAsArray() when return Promise', async () => {
    const current: R<number[]> = await OKA([1, 2, 3]).onEachAsArray(async (v) => {
      return OK(v);
    });

    expect(current.isSuccess()).toBeTruthy();
    expect(current).toEqual(OK([1, 2, 3]));
  });

  test('onEachAsArray() when return Error', async () => {
    const current: R<number[]> = await OKA([1, 2, 3]).onEachAsArray((v) => {
      if (v === 2) {
        return ERR('test_error');
      }

      return OK(v);
    });

    expect(current.isError()).toBeTruthy();
    expect(current).toEqual(ERR('test_error'));
  });
});
