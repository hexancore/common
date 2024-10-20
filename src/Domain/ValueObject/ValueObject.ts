import {
  type JsonSerialize,
  LogicError,
  type HObjectType,
  type PlainParseError,
  type R
} from '../../Util';

export type ValueObjectType<T extends ValueObject> = HObjectType<T>;

export abstract class ValueObject implements JsonSerialize {

  /**
   * Creates ValueObject from plain value
   * @param this
   * @param plain
   * @returns
   */
  public static parse<T extends ValueObject>(this: ValueObjectType<T>, plain: unknown): R<T, PlainParseError> {
    throw new LogicError("Not implemented or AOT generated");
  }

  public abstract equals(o: this): boolean;
  public abstract toString(): string;

  public toJSON(): any {
    throw new LogicError("Not implemented or AOT generated");
  }
}
