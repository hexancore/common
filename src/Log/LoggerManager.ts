import { LogicError } from '../Util/Error/LogicError';
import { AppMeta } from '../Util/AppMeta';
import { ConsoleLogger } from './ConsoleLogger';
import { checkTagsAreSame, isSameLogTags, Logger, LogTags } from './Logger';
import { NoopLogger } from './NoopLogger';
import { TestLogger } from './TestLogger';
import { AbstractLogger } from './AbstractLogger';

export type LoggerProvider = (name: string, tags: LogTags) => Logger;

export class LoggerManager {
  private loggers: Map<string, { logger: Logger; tags: string[] }>;

  public static i: LoggerManager;

  public constructor(private loggerProvider: LoggerProvider, private alwaysNew: boolean = false) {
    this.loggers = new Map<string, { logger: Logger; tags: string[] }>();
  }

  public getLogger(name: string, tags: string[] = []): Logger {
    const l = this.loggers.get(name);
    if (l) {
      checkTagsAreSame(name, tags, l.tags);
    }

    if (this.alwaysNew || l === undefined) {
      let logger = this.loggerProvider(name, tags);
      this.loggers.set(name, { logger, tags });
      return logger;
    }

    return l.logger;
  }

  public static getDefaultLoggerProvider(): LoggerProvider {
    const appMeta = AppMeta.get();
    if (appMeta.logSilent) {
      return () => new NoopLogger();
    }

    AbstractLogger.setGlobalOptions({ debug: appMeta.debug, silent: appMeta.logSilent });

    switch (appMeta.env) {
      case 'dev':
        return (name: string, tags: Array<string> = []) => ConsoleLogger.create(name, tags);
      case 'test':
        return (name: string, tags: Array<string> = []) => new TestLogger(name, tags);
      case 'prod':
        return (name: string, tags: Array<string> = []) => ConsoleLogger.create(name, tags);
    }
  }
}

export function getLogger(name: string, tags: string[] = []): Logger {
  if (LoggerManager.i === undefined) {
    const appMeta = AppMeta.get();
    LoggerManager.i = new LoggerManager(LoggerManager.getDefaultLoggerProvider(), appMeta.isTest());
  }
  return LoggerManager.i.getLogger(name, tags);
}

/**
 * Decorator inject logger to property.
 * @param name
 * @param tags
 * @returns
 */
export function InjectLogger(name: string, tags: string[] = []) {
  return (target: any, key: string) => {
    Object.defineProperty(target, key, {
      get() {
        return getLogger(name, tags);
      },
      enumerable: false,
    });
  };
}
