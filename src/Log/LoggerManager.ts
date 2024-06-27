import { AppMeta } from '../Util/AppMeta';
import { AbstractLogger } from './AbstractLogger';
import { ConsoleLogger } from './ConsoleLogger';
import { checkTagsAreSame, Logger, LogTags, type LogRecord } from './Logger';
import { NoopLogger } from './NoopLogger';
import { TestLogger } from './TestLogger';

export type LoggerProvider = (name: string, tags: LogTags) => Logger;

export class LoggerManager {
  private loggers: Map<string, { logger: Logger; tags: string[]; }>;
  private static i: LoggerManager;

  public constructor(private loggerProvider: LoggerProvider, private alwaysNew: boolean = false) {
    this.loggers = new Map<string, { logger: Logger; tags: string[]; }>();
  }

  public static set instance(manager: LoggerManager) {
    this.i = manager;
  }

  public static get instance(): LoggerManager {
    if (LoggerManager.i === undefined) {
      const appMeta = AppMeta.get();
      LoggerManager.i = new LoggerManager(LoggerManager.getDefaultLoggerProvider(), appMeta.isTest());
    }

    return LoggerManager.i;
  }

  public getLogger<T extends Logger = Logger>(name: string, tags: string[] = []): T {
    const l = this.loggers.get(name);
    if (l) {
      checkTagsAreSame(name, tags, l.tags);
    }

    if (this.alwaysNew || l === undefined) {
      const logger = this.loggerProvider(name, tags);
      this.loggers.set(name, { logger, tags });
      return logger as T;
    }

    return l.logger as T;
  }

  public getCurrentLoggerInstance<T extends Logger = Logger>(name: string): T | undefined {
    return this.loggers.get(name)?.logger as any;
  }

  public static getDefaultLoggerProvider(): LoggerProvider {
    const appMeta = AppMeta.get();
    if (appMeta.logSilent) {
      return () => new NoopLogger();
    }

    AbstractLogger.setGlobalOptions({ debug: appMeta.debug, silent: appMeta.logSilent });

    switch (appMeta.env) {
      case 'dev':
        return (name: string, tags: LogTags = []) => ConsoleLogger.create(name, tags as any);
      case 'test':
        return (name: string, tags: LogTags = []) => new TestLogger(name, tags as any);
      case 'prod':
        return (name: string, tags: LogTags = []) => ConsoleLogger.create(name, tags as any);
    }
  }
}

/**
 * Returns new or created before(in test always returns new) instance of logger with given name and tags.
 */
export function getLogger<T extends Logger = Logger>(name: string, tags: string[] = []): T {
  return LoggerManager.instance.getLogger(name, tags);
}

/**
 * Extracts logger instance from given object - usefull for testing logs writing in classes.
 */
export function extractLoggerFromObject<T extends Logger = Logger>(obj: any, property = 'logger'): T {
  return obj[property];
}

export function extractTestLoggerFromObject(obj: any, property = 'logger'): TestLogger {
  return extractLoggerFromObject(obj, property);
}

export function extractTestLoggerRecordsFromObject(obj: any, property = 'logger'): LogRecord[] {
  return  extractTestLoggerFromObject(obj, property).records;
}