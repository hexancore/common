import { AppError, AppErrorProps, INTERNAL_ERROR } from './AppError';
import { AR, ERRA } from './AsyncResult';

export type R<T> = Result<T>;

export type ExtractInnerResultType<P> = P extends Result<infer T> ? T : never;

export class Result<T> {
  private readonly value: any;
  public constructor(value: AppError | T) {
    this.value = value;
  }

  public isSuccess(): boolean {
    return !this.isError();
  }

  public get v(): T {
    if (this.isError()) {
      throw new ReferenceError("Can't use on ErrorResult: " + this.value.type);
    }

    return this.value;
  }

  public map<U>(fn: (v: T) => U): R<U> {
    if (this.isError()) {
      return this as unknown as R<U>;
    }

    return OK(fn(this.value));
  }

  public onOk<U>(fn: (v: T) => R<U>): R<U> {
    if (this.isError()) {
      return this as unknown as R<U>;
    }

    return fn(this.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onOkA<U>(fn: (v: T) => AR<U>): AR<U> {
    if (this.isError()) {
      return ERRA(this.value);
    }

    return fn(this.value);
  }

  public isError(): boolean {
    return this.value instanceof AppError;
  }

  public get e(): AppError {
    if (this.isError()) {
      return this.value;
    }

    throw new ReferenceError("Can't use on SuccessResult");
  }

  public mapErr(fn: (e: AppError) => AppError | AppErrorProps): R<T> {
    if (this.isSuccess()) {
      return this;
    }
    const v = fn(this.value);

    return ERR(v instanceof AppError ? v : new AppError(v));
  }

  public onErr<U>(fn: ((e: AppError) => R<U>) | Record<string, (e: AppError) => R<U>>): R<U | T> {
    if (this.isSuccess()) {
      return this;
    }

    if (fn instanceof Function) {
      return fn(this.value);
    }

    const c = fn[this.value.type];
    return c ? c(this.value) : this;
  }

  public static all<T extends Record<string, R<unknown>>>(
    results: T,
    error: { type: string; code: number } | string,
  ): R<{ [P in keyof T]: ExtractInnerResultType<T[P]> }> {
    const out: any = { ...results };

    let hasAnyError = false;
    for (const r in results) {
      hasAnyError = hasAnyError || results[r].isError();
      out[r] = results[r].isSuccess() ? results[r].v : results[r].e;
    }

    if (hasAnyError) {
      for (const r in results) {
        if (results[r].isSuccess()) {
          out[r] = null;
        }
      }

      return typeof error === 'string' ? ERR(error, 500, out) : ERR(error.type, error.code, out);
    }

    return OK(out) as any;
  }

  public static allToFirstError<T extends readonly R<unknown>[] | []>(
    results: T,
  ): R<any> | R<{ -readonly [P in keyof T]: ExtractInnerResultType<T[P]> }> {
    const values = [];
    for (const r of results) {
      if (r.isError()) {
        return r;
      }
      values.push(r.v);
    }

    return OK(values);
  }
}

export const OK = <T>(v: T): R<T> => {
  if (v instanceof Result) {
    return v;
  }

  return new Result<T>(v);
};

export const ERR = <T>(error: AppError | AppErrorProps | string, code = 400, data?: any): R<T> => {
  let e: AppError;
  if (typeof error === 'string') {
    e = new AppError({ type: error, code, data });
  } else {
    e = error instanceof AppError ? error : new AppError(error);
  }
  return new Result<T>(e);
};

export const ResultFrom = {
  all: <T>(results: Record<string, R<any>>): R<T> => {
    for (const r in results) {
      if (results[r].isError()) {
        return;
      }
    }

    const out = { ...results };

    for (const r in results) {
      out[r] = results[r];
    }

    return OK(out) as any;
  },
};

export const INTERNAL_ERR = <T>(error: Error): R<T> => {
  return ERR(INTERNAL_ERROR(error));
};
