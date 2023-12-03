/**
 * @group unit
 */

import { AppError, ERR, OK, Result } from '@';
import path from 'path';

describe(path.basename(__filename, '.test.ts'), () => {
  test('OK()', () => {
    const current = OK('test_data');

    expect(current.isSuccess()).toBeTruthy();
    expect(current.v).toBe('test_data');
    expect(() => current.e).toThrow("Can't use on SuccessResult");
  });

  test('ERR()', () => {
    const current = ERR('test_type', 400, 'test_data');

    expect(current.isError()).toBeTruthy();
    expect(current.e).toBeInstanceOf(AppError);
    expect(current.e.type).toBe('test_type');
    expect(current.e.code).toBe(400);
    expect(current.e.data).toBe('test_data');
    expect(() => current.v).toThrow("Can't use on ErrorResult: test_type");
  });

  test('map() when SuccessResult', () => {
    const current = OK('test_data').map((v: string) => v.toUpperCase());

    expect(current.isSuccess()).toBeTruthy();
    expect(current.v).toBe('TEST_DATA');
  });

  test('map() when ErrorResult', () => {
    const error = ERR('test_type', 400, 'test_data');
    const current = error.map((v: string) => v.toUpperCase());

    expect(current).toBe(error);
  });

  test('mapErr() when SuccessResult', () => {
    const ok = OK('test_data');
    const current = ok.mapErr((e: AppError) => ({ type: 'test_new_type', cause: e }));

    expect(current).toBe(ok);
  });

  test('mapErr() when ErrorResult', () => {
    const error = new AppError({ type: 'test_type', code: 400 });
    const current = ERR(error).mapErr((e: AppError) => ({ type: 'test_new_type', cause: e }));

    expect(current.isError()).toBeTruthy();
    expect(current.e.type).toBe('test_new_type');
    expect(current.e.cause).toBe(error);
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
      const current = Result.all(results, "test");

      expect(current).toEqual(OK({result_1: 10, result_2: 'test'}));
    });

    test('when one error', () => {
      const results = {
        result_1: OK(10),
        result_2: ERR("test"),
      };
      const current = Result.all(results, "test_main");
      expect(current).toMatchAppError({type: "test_main", code: 500, data:{result_1: null, result_2: results.result_2.e}});
    });
  });
});
