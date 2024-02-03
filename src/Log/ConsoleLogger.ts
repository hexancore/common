import { AppMeta } from '../Util/AppMeta';
import lambdalogPackage from 'lambda-log';
const { LambdaLog } = lambdalogPackage;
import { AbstractLogger } from './AbstractLogger';

import { Logger, LogLevel, LogTags, LogTagsFactory } from './Logger';

export class ConsoleLogger extends AbstractLogger {
  private static handler: any;

  private static getHandler() {
    if (this.handler === undefined) {
      const appMeta = AppMeta.get();
      this.handler = new LambdaLog({
        dev: appMeta.logPretty,
        debug: appMeta.debug,
        silent: appMeta.logSilent,
        levelKey: 'level',
        tagsKey: 'tags',
        messageKey: 'msg',
        dynamicMeta: () => {
          return {
            time: new Date().toISOString(),
          };
        },
      });
    }
    return this.handler;
  }

  public static create(channel: string, tags: Exclude<LogTags, LogTagsFactory>): Logger {
    return new this(channel, tags);
  }

  protected pushRecord(level: LogLevel, message: string, context: Record<string, any>, tags: string[]): void {
    ConsoleLogger.getHandler().log(level, message, context, tags);
  }
}
