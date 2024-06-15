import { LogicError } from '../Error';
import {
  UnknownErrorType,
  AppError,
  ExcludeNeverError,
  INTERNAL_ERROR,
  NeverError,
  StdErrors,
  AppErrorParameterType,
  AppErrorHandler,
  AppErrorCode,
} from '../Error/AppError';
import { CastVoidToUnknownMarker, EnumValueOrString, ExcludeUnknown, TUNKNOWN } from '../types';
import { ARW, AnyAsyncResult, AsyncResult, AsyncResultOnOkReturn, ExtractAsyncResult, P } from './AsyncResult';

export type R<T, ET extends string = UnknownErrorType> = Result<T, ET>;
export type AnyResult = Result<any, any>;
export type ExcludeResults<T> = Exclude<T, AnyResult>;
export type ExtractResults<T> = Extract<T, AnyResult>;

export type ExtractResultType<R> = R extends Result<infer T, any> ? ExcludeUnknown<T> : never;
export type ExtractResultTypes<T> = T extends AnyResult ? ExtractResultType<T> : T;

export type ExtractResultErrorType<P> = P extends Result<any, infer T> ? ExcludeNeverError<T> : never;
export type ExtractResultErrorTypes<T, ET extends string> = [ET] extends [NeverError]
  ? [T extends AnyResult ? ExtractResultErrorType<T> : NeverError] extends [NeverError]
  ? NeverError
  : ExtractResultErrorType<T>
  : ET;

type ResultOnOkReturn<U, ET extends string, _R = R<ExtractResultTypes<U>, ExtractResultErrorTypes<U, ET>>> = U extends AnyAsyncResult
  ? AsyncResultOnOkReturn<ET, U>
  : _R;

type ResultOnErrReturn<T, U, ET extends string> = T extends TUNKNOWN
  ? R<ExtractResultTypes<U>, ExtractResultErrorTypes<U, ET>>
  : R<ExtractResultTypes<U> | T, ExtractResultErrorTypes<U, ET>>;

/*type ResultOnErrReturn<
  T,
  U,
  ET extends string,
  ETK extends string,
  _R = R<
    ExtractResultTypes<U>,
    [ET] extends [ETK] ? ExtractResultErrorTypes<U, NeverError> : ExtractResultErrorTypes<U, NeverError> | Exclude<ET, ETK>
  >,
> = U extends AnyAsyncResult ? AsyncResultOnOkReturn<NeverError, U> : T extends void ? _R | R<undefined, NeverError> : _R | R<T, NeverError>;
*/
export function WrapToResult<T>(v: any): T {
  if (v instanceof Result || v instanceof AsyncResult) {
    return v as any;
  }

  if (v instanceof Promise) {
    return ARW(v) as any;
  }

  return new Result(v) as any;
}

export class Result<T, ET extends string = UnknownErrorType> {
  private readonly value: any;
  public constructor(value: AppError<ET> | T) {
    this.value = value;
  }

  public isSuccess(): boolean {
    return !this.isError();
  }

  public get v(): T {
    if (this.isError()) {
      throw new LogicError("Can't use v() on ErrorResult: " + this.value.type);
    }

    return this.value;
  }

  /**
   * Calls fn when result is success and return result from fn(wraps value to Result when need)
   * @param fn
   * @returns
   */
  public onOk<U>(fn: (v: T) => U): ResultOnOkReturn<U, ET> {
    return this.isError() ? (this as any) : WrapToResult(fn(this.value));
  }

  public isError(): boolean {
    return this.value instanceof AppError;
  }

  /**
   * Returns error value when Result is error.
   * @throws LogicError When value result is not error.
   */
  public get e(): AppError<ET> {
    if (this.isError()) {
      return this.value;
    }

    throw new LogicError("Can't use e() on SuccessResult");
  }

  /**
   * Calls fn when result is error and return result from fn(wraps value to Result when need)
   * @param fn
   * @returns
   */
  public onErr<U, FET extends ExcludeNeverError<ET>>(
    fnOrErrorType: FET | AppErrorHandler<ET, U>,
    fn?: AppErrorHandler<FET, U>,
  ): ResultOnErrReturn<T, CastVoidToUnknownMarker<U>, Exclude<ET, FET>> {
    if (this.isSuccess()) {
      return this as any;
    }

    if (fnOrErrorType instanceof Function) {
      return WrapToResult(fnOrErrorType(this.value));
    }



    if ((this.value.type as any) === fnOrErrorType) {
      if (!fn) {
        throw new LogicError('When error type is given then handler on 2nd parameter must be defined');
      }
      return WrapToResult(fn(this.value as any));
    }

    return this as any;
  }

  /**
   * Throws PanicError when result is error
   */
  public panicIfError(): void {
    if (this.isError()) {
      this.e.panic();
    }
  }

  public static all<T extends Record<string, R<unknown>>>(
    results: T,
    error: { type: string; code: number; } | string,
  ): R<{ [P in keyof T]: ExtractResultType<T[P]> }, { [P in keyof T]: ExtractResultErrorType<T[P]> }[keyof T]> {
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

      return (typeof error === 'string' ? ERR(error, 500, out) : ERR(error.type, error.code, out)) as any;
    }

    return OK(out) as any;
  }

  public static allToFirstError<T extends readonly R<any>[] | []>(results: T): R<any> | R<{ -readonly [P in keyof T]: ExtractResultType<T[P]> }> {
    const values: any[]  = [];
    for (const r of results) {
      if (r.isError()) {
        return r;
      }
      values.push(r.v);
    }

    return OK(values);
  }
}

export const OK = <T, ET extends string = NeverError>(v: T): R<T, ET> => {
  if (v instanceof Result) {
    return v;
  }

  return new Result(v);
};

export const ERR = <T = TUNKNOWN, ET extends string = UnknownErrorType>(error: AppErrorParameterType<ET>, code = 400, data?: any): R<T, ET> => {
  return new Result<T, ET>(AppError.create(error, code, data));
};

export const INTERNAL_ERR = <T, E extends Error>(error: E): R<T, StdErrors['internal']> => {
  return ERR(INTERNAL_ERROR<E>(error));
};
