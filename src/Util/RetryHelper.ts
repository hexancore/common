import { AppError, AppErrorCode } from './Error/AppError';
import { AR, OKA, ERRA, ARW } from './Result';

export const RetryMaxAttemptsError = 'core.util.retry_helper.retry_max_attempts' as const;
export type RetryMaxAttemptsError = typeof RetryMaxAttemptsError;
export interface RetryOptions {
  id: string;
  maxAttempts?: number;
  retryDelay?: number | ((attempt: number, maxAttempts: number) => Promise<void>);
}

const defaultRetryDelayFn = (delay: number, attempt: number, maxAttempts: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export class RetryHelper {
  public static retryAsync<T>(fn: () => AR<T>, options: RetryOptions): AR<T, RetryMaxAttemptsError> {
    return ARW(async () => {
      const retryDelayFn = typeof options.retryDelay === 'function' ? options.retryDelay : defaultRetryDelayFn.bind(options.retryDelay);
      let lastError: AppError;
      for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
        const result = await fn();
        if (result.isSuccess()) {
          return OKA(result.v);
        }

        lastError = result.e;
        await retryDelayFn(attempt, options.maxAttempts);
      }

      return ERRA({
        type: RetryMaxAttemptsError,
        code: AppErrorCode.INTERNAL_ERROR,
        cause: lastError,
        data: { id: options.id },
      });
    });
  }
}
