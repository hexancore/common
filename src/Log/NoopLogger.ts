import { AppError } from '../Util/Error/AppError';
import { Result } from '../Util/Result';
import { LogContext, Logger, LogLevel, LogMessage, LogTags } from './Logger';

/**
 * Used in silent log mode
 */
export class NoopLogger implements Logger {
  public logResult(r: Result<any>): void {}
  public log(levelOrAppError: LogLevel | AppError, messageOrTags?: LogMessage | LogTags, context?: LogContext, tags?: LogTags): void {}
  public debug(message: LogMessage, context?: LogContext, tags?: LogTags): void {}
  public info(message: LogMessage, context?: LogContext, tags?: LogTags): void {}
  public warn(message: LogMessage, context?: LogContext, tags?: LogTags): void {}
  public error(message: LogMessage, context?: LogContext, tags?: LogTags): void {}
}
