import {
  JsonSerialize,
  LogicError,
  type HObjectType,
  type PlainParseError,
  type R
} from '../../Util';

export type ValueObjectType<T extends HValueObject> = HObjectType<T>;

export abstract class HValueObject implements JsonSerialize {
  /**
   * Creates ValueObject from plain value
   * @param this
   * @param plain
   * @returns
   */
  public static parse<T extends HValueObject>(this: ValueObjectType<T>, plain: unknown): R<T, PlainParseError> {
    throw new LogicError("Not implemented or AOT generated");
  }

  public abstract equals(o: this): boolean;
  public abstract toString(): string;

  public toJSON(): any {
    throw new LogicError("Not implemented or AOT generated");
  }
}
