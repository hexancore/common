import { LogicError } from '../Util/Error/LogicError';
import { AppError } from '../Util/AppError';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogContextFactory = () => Record<string, any>;
export type LogContext = Record<string, any> | LogContextFactory;

export type LogMessageFactory = (context: Exclude<LogContext, LogContextFactory>) => string;
export type LogMessage = string | LogMessageFactory;

export type LogTagsFactory = (context: Exclude<LogContext, LogContextFactory>) => string[];
export type LogTags = string[] | LogTagsFactory;

export function isSameLogTags(tags: string[], other: string[]): boolean {
  if (tags.length !== other.length) {
    return false;
  }
  const set = new Set(tags);
  return other.every((value) => set.has(value));
}

export function checkTagsAreSame(loggerName: string, tags: string[], other: string[]): void {
  if (!isSameLogTags(tags, other)) {
    throw new LogicError(`Tags for logger ${loggerName} are not same`);
  }
}

export interface LogRecord {
  level: LogLevel;
  message: string;
  context: Record<string, any>;
  tags: string[];
}

export interface Logger {
  /**
   * Log with selected level.
   * @param level
   * @param message
   * @param context
   * @param tags
   */
  log(level: LogLevel, message: LogMessage, context?: LogContext, tags?: LogTags): void;

  /**
   * Log AppError
   * @param error
   * @param tags
   */
  log(error: AppError, tags?: LogTags): void;

  /**
   * Intended to be used in pre-prod environments or locally.
   * Use this log level when you don’t want to remove a log-print when merging (because it may prove useful),
   * but also don’t want it to show up in production.
   * There should be a flag/environment-variable that can turn on debug printing (even in production) but it should be used scarcely.
   * @param message
   * @param context
   * @param tags
   */
  debug(message: LogMessage, context?: LogContext, tags?: LogTags): void;

  /**
   * Useful information related to the operation of the system
   * @param message
   * @param context
   * @param tags
   */
  info(message: LogMessage, context?: LogContext, tags?: LogTags): void;

  /**
   * Significant events indicate an error,
   * but the behavior is either expected or not critical.
   * This could be a failed charge where there’s a retry in place, for example.
   * @param message
   * @param context
   * @param tags
   */
  warn(message: LogMessage, context?: LogContext, tags?: LogTags): void;

  /**
   * Log entries that indicate a system error that may be critical.
   * For example, an HTTP call failed.
   * @param message
   * @param context
   * @param tags
   */
  error(message: LogMessage, context?: LogContext, tags?: LogTags): void;
}
