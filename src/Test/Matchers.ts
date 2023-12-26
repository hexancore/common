/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { AppError, AppErrorProps, Result } from '../Util';

interface HexancoreCommonMatchers<R = unknown> {
  toMatchSuccessResult(expected: any): R;
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
  toMatchSuccessResult(received, expected) {
    if (!(received instanceof Result)) {
      return {
        message: () => `Expected: instance of success result\n Received: ${this.utils.printReceived(received)}`,
        pass: false,
      };
    }

    const printExpectedAndReceived = (current): string => {
      return `${this.utils.printExpected(expected)}\nReceived:\n ${this.utils.printReceived(current)}`;
    };

    const messageHeader = `Expected result value to be${this.isNot ? ' not' : ''}:\n`;

    if (received.isError()) {
      return {
        message: () => `${messageHeader} ${this.utils.printExpected(expected)}\nReceived error:\n ${JSON.stringify(received.e, undefined, 2)}`,
        pass: false,
      };
    }

    const current = received.v;
    const pass = this.equals(current, expected);
    const finalPass = this.isNot ? !pass : pass;

    return {
      pass: pass,
      message: () => {
          if (this.isNot) {
            return `${messageHeader} ${printExpectedAndReceived(current)}`;
          } else {
            return finalPass
            ? `${messageHeader} ${printExpectedAndReceived(current)}`
            : `${messageHeader} ${printExpectedAndReceived(current)}\n\n${this.utils.diff(expected, current, )}`;
          }

      }
    };
  },

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
