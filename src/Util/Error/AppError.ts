import { LogLevel, LogRecord } from '../../Log';
import { JsonSerialize } from '../..';
import { ErrorHelper, ErrorPlain } from './ErrorHelper';

export type UnknownErrorType = string & { __hce?: true };

export const StdErrors = {
  ignore: 'core.ignore_error',
  internal: 'core.internal_error',
  never_error: 'core.never_error',
} as const;
export type StdErrors = typeof StdErrors;

export type NeverError = StdErrors['never_error'];
export type IgnoreError = StdErrors['ignore'];
export type InternalError = StdErrors['internal'];

export type ExcludeNeverError<T> = [T] extends [NeverError] ? T : T extends NeverError ? never : T;

/**
 * Type to create type generates union of error types.
 */
export type DefineErrorsUnion<ET, K extends keyof ET, internal extends 'internal' | 'never_internal' = 'never_internal'> = internal extends 'internal'
  ? StdErrors['internal'] | ET[K]
  : ET[K];

export enum AppErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  SERVICE_UNAVAILABLE = 503,
}

export type ErrorFn<ET extends string = StdErrors['internal'], E extends Error = Error> = (e: unknown) => AppError<ET, E> | AppErrorProps<ET, E>;
export const DefaultErrorFn: ErrorFn = (e) => (e instanceof AppError ? e : INTERNAL_ERROR(e as Error));

export type AppErrorHandler<ET extends string, U> = (e: AppError<ET, Error>) => U;

export interface AppErrorProps<ET extends string = UnknownErrorType, E extends Error = Error> {
  type: ET;
  code?: number | AppErrorCode;
  data?: any;
  i18n?: string;
  message?: string;
  error?: E;
  cause?: AppError;
}
export type AppErrorParameterType<ET extends string = UnknownErrorType> = AppError<ET> | AppErrorProps<ET> | ET;

export interface AppErrorLogContext {
  type: string;
  error?: ErrorPlain;
  cause?: AppErrorLogContext;
  data?: any;
  code?: any;
}

export class PanicError<E extends Error = Error> extends Error {
  public constructor(e: AppError<any, E>) {
    const context = e.data ? JSON.stringify(e.data) : undefined;
    super(e.getLogMessage() + (context ? ': ' + context : ''), e.error ? { cause: e.error } : undefined);
  }
}

/**
 * Represents app error like invalid user input data
 */
export class AppError<ET extends string = UnknownErrorType, E extends Error = Error> implements AppErrorProps<ET, E>, JsonSerialize {
  /**
   * unique string for error type, format: `<module>.<scope>.[subscopes].<error_type>`.
   * module - module name(in snake case)
   * scope - `application|domain|infra|util`
   * subscope - optional subscopes like `person`,
   * Example `my_module.domain.person.invalid_plain`.
   */
  public readonly type: ET;
  public readonly code: number | AppErrorCode;
  public readonly data: any;
  public readonly i18n: string;
  public readonly message: string;
  public readonly error: E;
  public readonly cause: AppError;

  public constructor(props: AppErrorProps<ET, E>) {
    if (props.error && props.code === undefined) {
      props.code = AppErrorCode.INTERNAL_ERROR;
    }

    if (props.code === undefined) {
      props.code = AppErrorCode.BAD_REQUEST;
    }

    props.i18n = props.i18n ?? '';
    props.message = props.message ?? '';
    props.data = props.data ?? null;
    props.error = props.error ?? null;
    props.cause = props.cause ?? null;

    Object.assign(this, props);
  }

  public static create<ET extends string>(error: AppErrorParameterType<ET>, code = 400, data?: any): AppError<ET> {
    if (typeof error === 'string') {
      return new AppError({ type: error, code, data });
    }

    return error instanceof AppError ? error : new AppError(error);
  }

  public static IGNORE(): AppError<StdErrors['ignore']> {
    return new this({ type: StdErrors.ignore });
  }

  public static INTERNAL<E extends Error = Error>(error: E): AppError<StdErrors['internal'], E> {
    return new this({
      type: StdErrors.internal,
      code: AppErrorCode.INTERNAL_ERROR,
      message: error.message,
      error,
    });
  }

  public isIgnoreError(): boolean {
    return this.type === StdErrors.ignore;
  }

  public isInternalError(): boolean {
    return this.type === StdErrors.internal;
  }

  public toJSON(): any {
    const r: any = Object.assign({}, this);
    if (this.error) {
      r.error = ErrorHelper.toPlain(this.error);
    }
    return r;
  }

  public tryCastErrorTo<CE extends Error>(errorCtr: new (...args: any[]) => CE): AppError<ET, CE> | null {
    return this.isErrorInstanceOf(errorCtr) ? this : null;
  }

  public isErrorInstanceOf<E extends Error>(errorCtr: new (...args: any[]) => E): this is AppError<ET, E> {
    return this.error instanceof errorCtr;
  }

  public getLogRecord(): Omit<LogRecord, 'tags'> {
    return {
      level: this.getLogLevel(),
      message: this.getLogMessage(),
      context: this.getLogContext(),
    };
  }

  public getLogMessage(): string {
    if (this.message) {
      return this.message;
    }

    if (this.error) {
      return this.error.message;
    }

    return this.type as any;
  }

  public getLogContext(): AppErrorLogContext {
    const context: AppErrorLogContext = {
      type: this.type as any,
      code: this.code,
    };

    if (this.data !== undefined) {
      context.data = this.data;
    }

    if (this.error) {
      context.error = ErrorHelper.toPlain(this.error);
    }

    if (this.cause) {
      context.cause = this.cause.getLogContext();
    }

    return context;
  }

  public getLogLevel(): LogLevel {
    if (this.error || this.code >= 500) {
      return 'error';
    }

    if (this.isIgnoreError()) {
      return 'debug';
    }

    return 'warn';
  }

  public panic(): void {
    throw new PanicError(this);
  }
}

export function isAppError(value: any): value is AppError {
  return value instanceof AppError;
}

export function IGNORE_ERROR(): AppError<StdErrors['ignore']> {
  return AppError.IGNORE();
}

export function isIgnoreError(e: AppError): boolean {
  return e.isIgnoreError();
}

export function INTERNAL_ERROR<E extends Error = Error>(error: E): AppError<StdErrors['internal'], E> {
  return AppError.INTERNAL(error);
}

export function isInternalError(e: AppError): boolean {
  return e.isIgnoreError();
}
