import { R, ERR,  AR, ERRA } from '../Result';

export type RawErrorEnum = Record<string, any>;

/**
 * Wrapper for error type in ErrorEnum
 */
export class EnumErrorTypeWrapper {
  public constructor(public readonly t: string) {}

  public err<T>(data?: any | (() => any)): R<T> {
    return ERR(this.t, 400, data);
  }

  public erra<T>(data?: any | (() => any)): AR<T> {
    return ERRA(this.t, 400, data);
  }

  public toString(): string {
    return this.t;
  }
}