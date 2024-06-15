import { AppError, AppErrorCode } from './Error/AppError';
import { AR, OKA, ERRA, ARW } from './Result';

export const RetryMaxAttemptsError = 'core.util.retry_helper.retry_max_attempts' as const;
export type RetryMaxAttemptsError = typeof RetryMaxAttemptsError;
export type RetryDelayFn = (attempt: number, maxAttempts: number) => Promise<void>;
export interface RetryOptions {
  id: string;
  maxAttempts?: number;
  retryDelay?: number | RetryDelayFn;
}

const defaultRetryDelayFn = (delay: number, _attempt: number, _maxAttempts: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export class RetryHelper {
  public static retryAsync<T>(fn: () => AR<T>, options: RetryOptions): AR<T, RetryMaxAttemptsError> {
    const maxAttempts = 3;
    const retryDelayFn: RetryDelayFn = typeof options.retryDelay === 'function' ? options.retryDelay : defaultRetryDelayFn.bind(options.retryDelay) as any;
    return ARW(async () => {
      let lastError: AppError | null = null;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const result = await fn();
        if (result.isSuccess()) {
          return OKA(result.v);
        }

        lastError = result.e;
        await retryDelayFn(attempt, maxAttempts);
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
