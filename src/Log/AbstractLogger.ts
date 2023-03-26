import { ErrorHelper, LogicError } from '../Util';
import { AppError } from '../Util/AppError';
import { LogContext, Logger, LogLevel, LogMessage, LogTags } from './Logger';

export abstract class AbstractLogger implements Logger {
  public constructor(protected isDebug: boolean, protected silent: boolean) {}

  public log(levelOrAppError: LogLevel | AppError, messageOrTags?: LogMessage | LogTags, context?: LogContext, tags: LogTags = []): void {
    if (this.silent) {
      return;
    }

    if (levelOrAppError instanceof AppError) {
      this.logAppError(levelOrAppError, messageOrTags as LogTags);
    } else {
      if (!this.canLog(levelOrAppError)) {
        return;
      }

      if (messageOrTags === undefined) {
        throw new LogicError('Missing message, check code');
      }

      context = this.processContext(context);
      messageOrTags = this.processMessage(messageOrTags as LogMessage, context);
      tags = this.processTags(context, tags);
      this.pushRecord(levelOrAppError, messageOrTags as string, context, tags);
    }
  }

  protected canLog(level: LogLevel): boolean {
    return (level === 'debug' && this.isDebug) || true;
  }

  protected logAppError(error: AppError, tags: LogTags = []) {
    const record = error.getLogRecord();
    if (!this.canLog(record.level)) {
      return;
    }
    tags = this.processTags(record.context, tags);
    this.pushRecord(record.level, record.message, record.context, tags);
  }

  protected processContext(context?: LogContext): Record<string, any> {
    context = typeof context === 'function' ? context() : context;
    if (typeof context === 'object' && context.error instanceof Error) {
      context.error = ErrorHelper.toPlain(context.error);
    }
    return context;
  }

  protected abstract pushRecord(level: LogLevel, message: string, context?: Record<string, any>, tags?: string[]): void;

  protected processMessage(message: LogMessage, context?: Record<string, any>): string {
    return typeof message === 'function' ? message(context) : message;
  }

  protected processTags(context?: Record<string, any>, tags?: LogTags): string[] {
    return typeof tags === 'function' ? tags(context) : tags;
  }

  public debug(message: LogMessage, context?: LogContext, tags?: LogTags): void {
    this.log('debug', message, context, tags);
  }

  public info(message: LogMessage, context?: LogContext, tags?: LogTags): void {
    this.log('info', message, context, tags);
  }

  public warn(message: LogMessage, context?: LogContext, tags?: LogTags): void {
    this.log('warn', message, context, tags);
  }

  public error(message: LogMessage, context?: LogContext, tags?: LogTags): void {
    this.log('error', message, context, tags);
  }
}
