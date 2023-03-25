import { AppMeta } from '@/Util/AppMeta';
import { LambdaLog } from 'lambda-log';
import { AbstractLogger } from './AbstractLogger';

import { Logger, LogLevel, LogTags, LogTagsFactory } from './Logger';

export class ConsoleLogger extends AbstractLogger {
  protected constructor(private w: LambdaLog) {
    super(w.options.debug, w.options.silent);
  }

  public static create(name: string, tags: Exclude<LogTags, LogTagsFactory>, logHandler?: Console): Logger {
    const appMeta = AppMeta.get();
    const native = new LambdaLog({
      dev: appMeta.logPretty,
      debug: appMeta.debug,
      silent: appMeta.logSilent,
      meta: { channel: name, app_id: appMeta.id, app_env: appMeta.env },
      tags,
      levelKey: 'level',
      tagsKey: 'tags',
      messageKey: 'message',
      dynamicMeta: () => {
        return {
          timestamp: new Date().toISOString(),
        };
      },
      logHandler,
    });
    return new this(native);
  }

  protected pushRecord(level: LogLevel, message: string, context?: Record<string, any>, tags?: string[]): void {
    this.w.log(level, message, { context }, tags);
  }
}
