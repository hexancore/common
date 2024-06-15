import { LogicError } from '../Error';
import {
  AppError,
  AppErrorCode,
  AppErrorHandler,
  AppErrorParameterType,
  DefaultErrorFn,
  ErrorFn,
  ExcludeNeverError,
  InternalError,
  NeverError,
  StdErrors,
  UnknownErrorType,
} from '../Error/AppError';
import { isIterable } from '../functions';
import { CastToIterable, DropLastParam, ExcludeUnknown, ExtractIterableType, TUNKNOWN } from '../types';
import { ERR, ExtractResultErrorTypes, ExtractResultTypes, INTERNAL_ERR, OK, R, Result, WrapToResult } from './Result';

/**
 * Alias type Promise<R<T,ET,E>>
 */
export type ARP<T, ET extends string = UnknownErrorType> = Promise<R<T, ET>>;

/**
 * Alias type Promise<Result<boolean>>
 */
export type BoolAsyncResultPromise<ET extends string = UnknownErrorType> = Promise<R<boolean, ET>>;

/**
 * Used as return callbacks inside AsyncResult
 */
export type INSAR<T = TUNKNOWN, ET extends string = UnknownErrorType> = R<T, ET> | AR<T, ET> | ARP<T, ET>;

/**
 * Type used for return sync or async result
 */
export type SAR<T, ET extends string = UnknownErrorType> = R<T, ET> | AR<T, ET>;

/**
 * Type used for return async result
 */
export type AR<T = TUNKNOWN, ET extends string = UnknownErrorType, ThisType = any> = AsyncResult<T, ET, ThisType>;

export type AnyAsyncResult = AsyncResult<any, any, any>;
export type ExcludeAsyncResult<T> = Exclude<T, AnyAsyncResult>;
export type ExtractAsyncResult<T> = Extract<T, AnyAsyncResult>;

export type ExtractAsyncResultType<R> = R extends AsyncResult<infer I, any> ? ExcludeUnknown<I> : never;
export type ExtractAsyncResultErrorType<R> = R extends AsyncResult<any, infer I> ? ExcludeNeverError<I> : never;

/**
 * Extracts all inner AsyncResult and Result types + other types as union
 */
export type ExtractAsyncResultTypes<T, ResultTypes = ExtractResultTypes<ExcludeAsyncResult<T>>> = T extends AnyAsyncResult
  ? ExtractAsyncResultType<ExtractAsyncResult<T>> | ResultTypes
  : ResultTypes;

/**
 * Extracts all inner AsyncResult and Result error types + ET as union
 */
export type ExtractAsyncResultErrorTypes<
  T,
  ET extends string,
  _R = T extends AnyAsyncResult ? ExtractAsyncResultErrorType<T> : ExtractResultErrorTypes<T, ET>,
> = [_R] extends [NeverError] ? NeverError : ExcludeNeverError<_R>;

type MakeNextAsyncResult<U, ET extends string> = AR<ExtractAsyncResultTypes<U>, ExtractAsyncResultErrorTypes<U, ET>>;
export type AsyncResultOnOkReturn<ET extends string, U> = MakeNextAsyncResult<U, ET>;

type AsyncResultOnErrReturn<T, U, ET extends string> = T extends TUNKNOWN
  ? AR<ExtractAsyncResultTypes<U>, ExtractAsyncResultErrorTypes<U, ET>>
  : AR<ExtractAsyncResultTypes<U> | T, ExtractAsyncResultErrorTypes<U, ET>>;

// experimental types
type FunctionWithLastArgument<T, U = any> = (...args: [...any[], T]) => U;
type ExtractKeysMatchingFunctionSignature<O, F> = {
  [K in keyof O]: O[K] extends F ? K : never;
}[keyof O];

type CastToAnyFunction<F> = (...args: any[]) => any;
// experimental types end

/**
 * Async version of Result with powerfull api :)
 */
export class AsyncResult<T, ET extends string = UnknownErrorType, ThisType = any> implements PromiseLike<R<T, ET>> {
  private callbackThis!: ThisType;

  public constructor(public readonly p: ARP<T, ET>) {}

  public static wrap<T, ET extends string = InternalError>(
    p: Promise<T> | (() => Promise<T>),
    errorFn?: ErrorFn<ET>,
  ): AR<ExtractResultTypes<T>, ExtractResultErrorTypes<T, ET>> {
    errorFn = errorFn ?? DefaultErrorFn;

    if (p instanceof Function) {
      p = p();
    }

    if (!(p instanceof Promise)) {
      throw new LogicError('AsyncResult.from need Promise or function returns promise');
    }

    return new AsyncResult(
      p
        .then((value: T) => (value instanceof Result ? value : OK(value)))
        .catch((e) => {
          e = errorFn(e);
          e = e instanceof AppError ? e : new AppError(e);
          return ERR(e);
        }),
    );
  }

  public static wrapOnOkTrue<ET extends string = InternalError>(p: Promise<any> | (() => Promise<any>), errorFn?: ErrorFn<ET>): AR<boolean, ET> {
    errorFn = errorFn ?? (DefaultErrorFn as any);
    return this.wrap(p).mapToTrue() as any;
  }

  public onOk<U>(fn: (v: T) => U): AsyncResultOnOkReturn<ET, U> {
    return new AsyncResult(
      this.p.then((inResult) => {
        if (inResult.isError()) {
          return inResult;
        }

        const v = fn(inResult.v);
        return WrapToResult(v) as any;
      }),
    ) as any;
  }
  /**
   * Adds callback called when error result comes from promise
   * @param errorType Runs callback only for selected errors types or '*' for any error
   * @param fn Callback
   * @returns this
   */
  public onErr<U, FET extends ExcludeNeverError<ET>>(
    fnOrErrorType: FET | AppErrorHandler<ET, U>,
    fn?: AppErrorHandler<FET, U>,
  ): AsyncResultOnErrReturn<T, U, Exclude<ET, FET>> {
    return new AsyncResult(
      this.p.then(async (r: R<T, ET>): Promise<any> => {
        if (r.isSuccess()) {
          return r;
        }

        if (fnOrErrorType instanceof Function) {
          return WrapToResult(fnOrErrorType(r.e as any));
        }

        if ((r.e.type as any) === fnOrErrorType) {
          if (!fn) {
            throw new LogicError('When error type is given then handler on 2nd parameter must be defined');
          }
          return WrapToResult(fn(r.e as any));
        }

        return r;
      }),
    ) as any;
  }

  public onEachAsArray<U, IT = ExtractIterableType<CastToIterable<T>>>(onEach: (v: IT) => INSAR<U>): AR<U[]> {
    return this.onOk(async (it) => {
      if (!isIterable(it)) {
        return INTERNAL_ERR(new Error('Result value is not Iterable'));
      }

      const list: any[] = [];
      for (const i of it as any) {
        let r = onEach(i);
        if (r instanceof Promise) {
          r = new AsyncResult(r);
        }

        if (r instanceof AsyncResult) {
          r = await r;
        }

        if (r.isError()) {
          return r as any;
        }

        list.push(r.v);
      }

      return OK(list);
    }) as any;
  }

  /**
   * Experimental API
   * @param newThis
   * @returns
   */
  public bind<NewThisType = ThisType>(newThis: NewThisType): AR<T, ET, NewThisType> {
    this.callbackThis = newThis as any;
    return this as any;
  }

  public mapToTrue(): AR<boolean, ET> {
    return this.onOk(() => OK(true)) as any;
  }

  /**
   * Experimental API
   * @param fn
   * @param thisArg
   * @param args
   * @returns
   */
  public onOkBind<F extends FunctionWithLastArgument<T>, U>(fn: F, thisArg: any, ...args: DropLastParam<F>): AsyncResultOnOkReturn<ET, U> {
    return this.onOk(fn.bind(thisArg, ...args)) as any;
  }

  /**
   * Experimental API
   * @param fn
   * @param args
   * @returns
   */
  public onOkThis<
    K extends ExtractKeysMatchingFunctionSignature<ThisType, FunctionWithLastArgument<T, U>>,
    F extends ThisType[K] & ((...args: any) => U),
    U = ThisType[K] extends (...args: any) => infer Z ? Z : never,
  >(fn: K, ...args: DropLastParam<F>): AsyncResultOnOkReturn<ET, U> {
    const callbackThis: any = this.callbackThis;
    return this.onOkBind(callbackThis[fn], this.callbackThis, ...args).bind(this.callbackThis) as any;
  }

  /**
   *  Experimental API
   *  Use callback function binded to thisArg with some args
   */
  public onErrBind<F extends FunctionWithLastArgument<AppError>, U = T>(
    fn: F,
    thisArg: any,
    ...argArray: DropLastParam<F>
  ): AsyncResultOnOkReturn<ET, U> {
    return this.onErr(fn.bind(thisArg, ...argArray)) as any;
  }

  /**
   *  Experimental API
   *  Use callback function binded to this binded with that result with some args
   */
  public onErrThis<U, K extends ExtractKeysMatchingFunctionSignature<ThisType, FunctionWithLastArgument<AppError>>, F extends ThisType[K]>(
    fn: K,
    ...args: DropLastParam<CastToAnyFunction<F>>
  ): AsyncResultOnOkReturn<ET, U> {
    const callbackThis: any = this.callbackThis;
    return this.onErrBind(callbackThis[fn], this.callbackThis, ...args);
  }

  public then<A, B>(
    successCallback?: (res: R<T, ET>) => A | PromiseLike<A>,
    failureCallback?: (reason: unknown) => B | PromiseLike<B>,
  ): PromiseLike<A | B> {
    return this.p.then(successCallback, failureCallback);
  }
}

/**
 * Shortcut for create Success AsyncResult
 * @param v - Result value
 * @returns AsyncResult with value
 */
export const OKA = <T, ET extends string = NeverError>(v: T): AR<T, ET> => new AsyncResult<T, ET>(Promise.resolve(OK(v)));
/**
 * Shortcut for create Success AsyncResult and get promise of it
 * @param v - Result value
 * @returns AsyncResult promise
 */
export const OKAP = <T, ET extends string = NeverError>(v: T): ARP<T, ET> => OKA<T, ET>(v).p;

/**
 * Shortcut for create Error AsyncResult
 * @param error - AppError or AppErrorProps or string as error type
 * @param code - Error code used when first param is string
 * @param data - Error data used when first param is string
 * @returns AsyncResult with AppError
 */
export const ERRA = <T = TUNKNOWN, ET extends string = UnknownErrorType>(
  error: AppErrorParameterType<ET>,
  code = AppErrorCode.BAD_REQUEST,
  data?: any,
): AR<T, ET> => {
  return new AsyncResult<T, ET>(Promise.resolve(ERR(error, code, data)));
};

/**
 * Shortcut for create Error AsyncResult and get promise of it
 * @param error - AppError or AppErrorProps or string as error type
 * @param code - Error code used when first param is string
 * @param data - Error data used when first param is string
 * @returns Promise from AsyncResult
 */
export const ERRAP = <T = TUNKNOWN, ET extends string = UnknownErrorType>(
  error: AppErrorParameterType<ET>,
  code = AppErrorCode.BAD_REQUEST,
  data?: any,
): ARP<T, ET> => ERRA<T, ET>(error, code, data).p as any;

/**
 * Shortcut for create internal error AsyncResult
 * @param error
 * @returns AsyncResult
 */
export const INTERNAL_ERRA = <T>(error: Error): AR<T, StdErrors['internal']> => {
  return new AsyncResult<T, StdErrors['internal']>(Promise.resolve(INTERNAL_ERR(error)));
};

/**
 * Shortcut AsyncResult.wrap
 * @param p Promise for wrap in AsyncResult
 * @param errorFn Error mapper to AppError
 * @returns
 */
export const ARW = AsyncResult.wrap;

/**
 * Shortcut AsyncResult.wrapOnOkTrue
 * @param p
 * @returns
 */
export const ARWB = AsyncResult.wrapOnOkTrue;

/**
 * @deprecated Use ARW
 * Shortcut AsyncResult.from
 * @param p Promise for wrap in AsyncResult
 * @param errorFn Error mapper to AppError
 * @returns
 */
export const P = AsyncResult.wrap;

/**
 * @deprecated Use ARW
 * Shortcut AsyncResult.from
 * @param p Promise for wrap in AsyncResult
 * @param errorFn Error mapper to AppError
 * @returns
 */
export const PS = AsyncResult.wrap;

/**
 * @deprecated Use ARWB
 * Shortcut AsyncResult.fromOnOkTrue
 * @param  p
 * @returns
 */
export const PB = AsyncResult.wrapOnOkTrue;
