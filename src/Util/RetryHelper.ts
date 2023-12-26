import { AppError, AppErrorCode } from './AppError';
import { AR, ARP, OKA, ERRA, PS } from './AsyncResult';

export interface RetryOptions {
  id: string;
  maxAttempts?: number;
  retryDelay?: number | ((attempt: number, maxAttempts: number) => Promise<void>);
}

const defaultRetryDelayFn = (delay: number, attempt: number, maxAttempts: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export class RetryHelper {
  public static async retryAsync<T>(fn: () => AR<T>, options: RetryOptions): ARP<T> {
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
      type: 'core.util.retry_helper.retry_max_attempts',
      code: AppErrorCode.INTERNAL_ERROR,
      cause: lastError,
      data: {id: options.id}
    });
  }
}
