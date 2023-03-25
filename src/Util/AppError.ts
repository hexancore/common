import { LogLevel, LogRecord, LogTags } from '.';
import { ErrorHelper, ErrorPlain } from './Error/ErrorHelper';

export const IGNORE_ERROR_TYPE = 'core.ignore_error';
export const INTERNAL_ERROR_TYPE = 'core.internal_error';

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

export interface AppErrorProps<ET extends Error = Error> {
  type: string;
  code?: number | AppErrorCode;
  data?: any;
  i18n?: string;
  message?: string;
  error?: ET;
  cause?: AppError<ET>;
}

export interface AppErrorLogContext {
  type: string;
  error?: ErrorPlain;
  cause?: AppErrorLogContext;
  data?: any;
  code?: any;
}

/**
 * Represents app error like invalid user input data
 */
export class AppError<ET extends Error = Error> implements AppErrorProps {
  /**
   * unique string for error type, format: `<module>.<scope>.[subscopes].<error_type>`.
   * module - module name(in snake case)
   * scope - `application|domain|infra|util`
   * subscope - optional subscopes like `person`,
   * Example `my_module.domain.person.invalid_plain`.
   */
  public readonly type: string;
  public readonly code?: number | AppErrorCode;
  public readonly data?: any;
  public readonly i18n?: string;
  public readonly message?: string;
  public readonly error?: ET;
  public readonly cause?: AppError<ET>;

  public constructor(props: AppErrorProps) {
    Object.assign(this, props);
    if (this.error && this.code === undefined) {
      this.code = AppErrorCode.INTERNAL_ERROR;
    }

    if (this.code === undefined) {
      this.code = AppErrorCode.BAD_REQUEST;
    }
  }

  public static IGNORE() {
    return new this({ type: IGNORE_ERROR_TYPE });
  }

  public static INTERNAL() {
    return new this({ type: INTERNAL_ERROR_TYPE });
  }

  public isIgnoreError(): boolean {
    return this.type === IGNORE_ERROR_TYPE;
  }

  public isInternalError(): boolean {
    return this.type === INTERNAL_ERROR_TYPE;
  }

  public toJSON() {
    const r: any = Object.assign({}, this);
    if (this.error) {
      r.error = ErrorHelper.toPlain(this.error);
    }
    return r;
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

    return this.type;
  }

  public getLogContext(): AppErrorLogContext {
    const context: AppErrorLogContext = {
      type: this.type,
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
}

export function isAppError(value: any): value is AppError {
  return value instanceof AppError;
}

export function IGNORE_ERROR(): AppError {
  return new AppError({ type: IGNORE_ERROR_TYPE });
}

export function isIgnoreError(e: AppError): boolean {
  return e.type === IGNORE_ERROR_TYPE;
}

export function INTERNAL_ERROR(error: Error): AppError {
  return new AppError({
    type: INTERNAL_ERROR_TYPE,
    code: AppErrorCode.INTERNAL_ERROR,
    message: error.message,
    error,
  });
}

export function isInternalError(e: AppError): boolean {
  return e.type === INTERNAL_ERROR_TYPE;
}
