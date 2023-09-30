/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { AppError, AppErrorProps, Result } from '../Util';

interface HexancoreCommonMatchers<R = unknown> {
  toMatchAppError(expected: AppErrorProps): R;
}

declare global {
  namespace jest {
    interface Expect extends HexancoreCommonMatchers {}
    interface Matchers<R> extends HexancoreCommonMatchers<R> {}
    interface InverseAsymmetricMatchers extends HexancoreCommonMatchers {}
  }
}

expect.extend({
  toMatchAppError(received: Result<any> | AppError, expected: AppError) {
    if (received instanceof Result && received.isSuccess()) {
      return {
        message: () => `Expected: ErrorResult \nReceived: ${this.utils.printReceived(received)}`,
        pass: false,
      };
    }

    const current = received instanceof Result ? received.e : received;

    const expectedObject: AppErrorProps = {
      type: expected.type ?? expect.any(String),
      code: expected.code ?? expect.any(Number),
      i18n: expected.i18n ?? expect.anything(),
      message: expected.message ?? expect.anything(),
    };

    if (expected.data) {
      expectedObject.data = expected.data;
    }

    if (expected.cause) {
      expectedObject.cause = expected.cause;
    }

    if (expected.error) {
      expectedObject.error = expected.error;
    }

    const expectedResult = expect.objectContaining(expectedObject);

    const pass = this.equals(current, expectedResult);
    if (pass) {
      return {
        message: () => `Expected: ${this.utils.printExpected(expectedResult)}\nReceived: ${this.utils.printReceived(current)}`,
        pass: true,
      };
    }

    return {
      message: () =>
        `Expected: ${this.utils.printExpected(expectedResult)}\nReceived: ${this.utils.printReceived(current)}\n\n${this.utils.diff(
          expectedResult,
          current,
        )}`,
      pass: false,
    };
  },
});
