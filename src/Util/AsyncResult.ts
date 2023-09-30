import { AppError, AppErrorCode, AppErrorProps, INTERNAL_ERROR } from './AppError';
import { isIterable } from './functions';
import { ERR, INTERNAL_ERR, OK, R, Result } from './Result';
import { DropLastParam, ExtractIterableType } from './types';

/**
 * Alias type Promise<Result<T>>
 */
export type ARP<T> = Promise<Result<T>>;

/**
 * Alias type Promise<Result<boolean>>
 */
export type BoolAsyncResultPromise = Promise<Result<boolean>>;

/**
 * Used as return callbacks inside AsyncResult
 */
export type INSAR<U> = Result<U> | AsyncResult<U> | ARP<U>;

/**
 * Type used for return sync or async result
 */
export type SAR<U> = Result<U> | AsyncResult<U>;

/**
 * Type used for return async result
 */
export type AR<T> = AsyncResult<T>;

type CastToIterable<T> = T extends Iterable<any> ? ExtractIterableType<T> : never;
export type ErrorFn = (e: unknown) => AppError | AppErrorProps;

export const DEFAULT_ERROR_FN: ErrorFn = (e) => (e instanceof AppError ? e : INTERNAL_ERROR(e as Error));

/**
 * Async version of Result with powerfull api :)
 */
export class AsyncResult<T> implements PromiseLike<Result<T>> {
  private callbackThis: any;

  public constructor(public readonly p: ARP<T>) {}

  public static fromSafePromise<T>(promise: Promise<T>): AsyncResult<T> {
    const newPromise = promise.then((value: T) => (value instanceof Result ? value :OK<T>(value)));
    return new AsyncResult(newPromise);
  }

  public static fromPromise<T>(promise: Promise<T>, errorFn?: ErrorFn): AsyncResult<T> {
    errorFn = errorFn ?? DEFAULT_ERROR_FN;

    const newPromise = promise
      .then((value: T) => (value instanceof Result ? value : OK<T>(value)))
      .catch((e) => {
        e = errorFn(e);
        e = e instanceof AppError ? e : new AppError(e);
        return ERR<T>(e);
      });

    return new AsyncResult(newPromise);
  }

  public static fromPromiseOkTrue(promise: Promise<any>, errorFn?: ErrorFn): AsyncResult<boolean> {
    errorFn = errorFn ?? DEFAULT_ERROR_FN;

    const newPromise = promise
      .then(() => OK<boolean>(true))
      .catch((e) => {
        e = errorFn(e);
        e = e instanceof AppError ? e : new AppError(e);
        return ERR<boolean>(e);
      });

    return new AsyncResult(newPromise).mapToTrue();
  }

  public bind(thisArg: any): AsyncResult<T> {
    this.callbackThis = thisArg;
    return this;
  }

  /**
   * backward compatibility use `p` property;
   */
  public get promise(): ARP<T> {
    return this.p;
  }

  public map<U>(f: (v: T) => U | Promise<U>): AR<U> {
    return new AsyncResult(
      this.p.then(async (res: Result<T>) => {
        if (res.isError()) {
          return ERR<U>(res.e);
        }

        return OK<U>(await f(res.v));
      }),
    );
  }

  public mapToTrue(): AR<boolean> {
    return this.map(() => true);
  }

  public mapErr(f: (e: AppError) => AppError | AppErrorProps | Promise<AppError | AppErrorProps>): AR<T> {
    return new AsyncResult(
      this.p.then(async (res: Result<T>) => {
        if (res.isSuccess()) {
          return OK<T>(res.v);
        }

        return ERR<T>(await f(res.e));
      }),
    );
  }

  public onOk<U>(f: (v: T) => INSAR<U>): AR<U> {
    return new AsyncResult(
      this.p.then((res) => {
        if (res.isError()) {
          return ERR<U>(res.e);
        }

        const newValue = f(res.v);
        if (!newValue) {
          return INTERNAL_ERR(new Error('Callback must always return some Result: ' + f.toString()));
        }
        return newValue instanceof AsyncResult ? newValue.p : newValue;
      }),
    );
  }

  public onEachAsArray<U, IT = CastToIterable<T>>(onEach: (v: IT) => INSAR<U>): AR<U[]> {
    return this.onOk(async (it) => {
      if (!isIterable(it)) {
        return INTERNAL_ERR(new Error('Result value is not Iterable'));
      }

      const list = [];
      for (let i of it as any) {
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
    });
  }

  public onOkBind<F extends (...args: [...any, T]) => INSAR<U>, U = any | T>(f: F, thisArg: any, ...argArray: DropLastParam<F>): AR<U> {
    return this.onOk(f.bind(thisArg, ...argArray));
  }

  public onOkThis<F extends (...args: [...any, T]) => INSAR<U>, U = any | T>(f: F, ...argArray: DropLastParam<F>): AsyncResult<U> {
    return this.onOkBind(f, this.callbackThis, ...argArray).bind(this.callbackThis);
  }

  /**
   * Adds callback called when error result comes from promise
   * @param errorType Runs callback only for selected errors types or '*' for any error
   * @param f Callback
   * @returns this
   */
  public onErr<U = T>(f: ((e: AppError) => INSAR<U>) | Record<string, (e: AppError) => INSAR<U>>): AR<U> {
    return new AsyncResult<U>(
      this.p.then(async (res: Result<T>): Promise<any> => {
        if (res.isError()) {
          if (f instanceof Function) {
            return f(res.e);
          }

          const c = f[res.e.type];
          return c ? c(res.e) : res;
        }

        return OK(res.v);
      }),
    );
  }

  /**
   *  Use callback function binded to thisArg with some args
   */
  public onErrBind<F extends (...args: [...any, AppError]) => INSAR<T>>(f: F, thisArg: any, ...argArray: DropLastParam<F>): AR<T> {
    return this.onErr(f.bind(thisArg, ...argArray));
  }

  /**
   *  Use callback function binded to this binded with that result with some args
   */
  public onErrThis<F extends (...args: [...any, AppError]) => INSAR<T>>(f: F, ...argArray: DropLastParam<F>): AR<T> {
    return this.onErrBind(f, this.callbackThis, ...argArray);
  }

  public then<A, B>(
    successCallback?: (res: Result<T>) => A | PromiseLike<A>,
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
export const OKA = <T>(v: T): AR<T> => new AsyncResult(Promise.resolve(OK<T>(v)));
/**
 * Shortcut for create Success AsyncResult and get promise of it
 * @param v - Result value
 * @returns AsyncResult promise
 */
export const OKAP = <T>(v: T): ARP<T> => OKA(v).p;

/**
 * Shortcut for create Error AsyncResult
 * @param error - AppError or AppErrorProps or string as error type
 * @param code - Error code used when first param is string
 * @param data - Error data used when first param is string
 * @returns AsyncResult with AppError
 */
export const ERRA = <T>(error: AppError | AppErrorProps | string, code = AppErrorCode.BAD_REQUEST, data?: any): AR<T> => {
  return new AsyncResult(Promise.resolve(ERR<T>(error, code, data)));
};

/**
 * Shortcut for create Error AsyncResult and get promise of it
 * @param error - AppError or AppErrorProps or string as error type
 * @param code - Error code used when first param is string
 * @param data - Error data used when first param is string
 * @returns Promise from AsyncResult
 */
export const ERRAP = <T>(error: AppError | AppErrorProps | string, code = AppErrorCode.BAD_REQUEST, data?: any): ARP<T> =>
  ERRA<T>(error, code, data).p;

/**
 * Shortcut for create internal error AsyncResult
 * @param error
 * @returns AsyncResult
 */
export const INTERNAL_ERRA = <T>(error: Error): AR<T> => {
  return new AsyncResult(Promise.resolve(INTERNAL_ERR(error)));
};

/**
 * Shortcut AsyncResult.fromPromise
 * @param p Promise for wrap in AsyncResult
 * @param errorFn Error mapper to AppError
 * @returns
 */
export const P = AsyncResult.fromPromise;
/**
 * Shortcut AsyncResult.fromSafePromise
 * @param p
 * @returns
 */
export const PS = AsyncResult.fromSafePromise;
/**
 * Shortcut AsyncResult.fromPromiseOkTrue
 * @param  p
 * @returns
 */
export const PB = AsyncResult.fromPromiseOkTrue;
