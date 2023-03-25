import { AppError } from '../Util/AppError';
import { Result } from '../Util/Result';
import { LogContext, Logger, LogLevel, LogMessage, LogTags } from './Logger';

export class NullLogger implements Logger {
  logResult(r: Result<any>): void {}
  log(levelOrAppError: LogLevel | AppError, messageOrTags?: LogMessage | LogTags, context?: LogContext, tags?: LogTags): void {}
  debug(message: LogMessage, context?: LogContext, tags?: LogTags): void {}
  info(message: LogMessage, context?: LogContext, tags?: LogTags): void {}
  warn(message: LogMessage, context?: LogContext, tags?: LogTags): void {}
  error(message: LogMessage, context?: LogContext, tags?: LogTags): void {}
}
