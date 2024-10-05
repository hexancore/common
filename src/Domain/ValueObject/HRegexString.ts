import { LogicError, OK, StringPlainParseHelper, PlainParseHelper, PlainParseIssue, type PlainParseError, type R } from '../../Util';
import { HValueObject,  type ValueObjectType } from "./HValueObject";

export abstract class HRegexString extends HValueObject {
  public constructor(public readonly v: string) {
    super();
  }

  public static parse<T extends HValueObject>(this: ValueObjectType<T> & { getRegex(): RegExp; }, plain: unknown): R<T, PlainParseError> {
    const parsed = StringPlainParseHelper.parseStringRegex(plain, this.getRegex());
    if (parsed instanceof PlainParseIssue) {
      return PlainParseHelper.HObjectParseErr(this, [parsed]);
    }

    return OK(new this(parsed));
  }

  public static getRegex(): RegExp {
    throw new LogicError("Must be implemented in value object class");
  }

  /**
   * Creates instance without extra validation.
   * @param v
   * @returns
   */
  public static cs<T extends HRegexString>(this: ValueObjectType<T>, v: string): T {
    return new this(v);
  }

  public equals(other: this): boolean {
    return this.v === other.v;
  }

  public toString(): string {
    return this.v;
  }

  public toJSON(): string {
    return this.v;
  }
}