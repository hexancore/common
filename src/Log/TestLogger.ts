import { LogLevel, LogRecord } from '../Util';
import { AbstractLogger } from './AbstractLogger';

/**
 * Used for testing things
 */
export class TestLogger extends AbstractLogger {
  public records: Array<LogRecord> = [];

  public constructor(public readonly name, public readonly tags: string[]) {
    super(true, false);
  }

  protected pushRecord(level: LogLevel, message: string, context?: Record<string, any>, tags?: string[]): void {
    this.records.push({ level, message, context, tags });
  }

  public clear(): void {
    this.records = [];
  }
}
