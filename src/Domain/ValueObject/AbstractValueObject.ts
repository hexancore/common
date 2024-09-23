import {
  JsonSerialize,
  LogicError,
  type HObjectType,
  type PlainParseError,
  type R
} from '../../Util';

export type AnyValueObject = AbstractValueObject<any>;
export type ValueObjectType<T extends AnyValueObject = AnyValueObject> = HObjectType<T>;

export abstract class AbstractValueObject<T extends AnyValueObject> implements JsonSerialize {
  /**
   * Creates ValueObject from plain value
   * @param this
   * @param plain
   * @returns
   */
  public static parse<T>(this: (new (...args: any[]) => any), plain: unknown): R<T, PlainParseError> {
    throw new LogicError('Not implemented or AOT generated');
  }

  public abstract equals(o: T): boolean;
  public abstract toString(): string;

  public toJSON(): any {
    throw new LogicError('Not implemented or AOT generated');
  }
}
