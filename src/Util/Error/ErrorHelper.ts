export interface ErrorPlain {
  type: string;
  message: string;
  stacktrace: string[];
}

/**
 * Helper for manipulate Error objects.
 */
export class ErrorHelper {
  /**
   * Maps Error object to some plain form.
   * @param e
   * @returns
   */
  public static toPlain(e: Error): ErrorPlain {
    return {
      type: e.constructor.name,
      message: e.message,
      stacktrace: e.stack ? this.convertStackTraceToArray(e.stack) : [],
    };
  }

  public static convertStackTraceToArray(stack: string): string[] {
    return stack
      .split('\n')
      .slice(1) //first element is message
      .map((v) => v.trim());
  }
}
