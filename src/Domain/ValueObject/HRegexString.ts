import { LogicError, OK, StringPlainParseHelper, PlainParseHelper, PlainParseIssue, type PlainParseError, type R } from '../../Util';
import { AbstractValueObject, type AnyValueObject, type ValueObjectType } from "./AbstractValueObject";

export abstract class HRegexString<T extends HRegexString<any>> extends AbstractValueObject<T> {
  public constructor(public readonly v: string) {
    super();
  }

  public static parse<T extends AnyValueObject>(this: ValueObjectType<T> & { getRegex(): RegExp; }, plain: unknown): R<T, PlainParseError> {
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
  public static cs<T extends HRegexString<any>>(this: ValueObjectType<T>, v: string): T {
    return new (this as any)(v);
  }

  public equals(other: T): boolean {
    return this.v === other.v;
  }

  public toString(): string {
    return this.v;
  }

  public toJSON(): string {
    return this.v;
  }
}