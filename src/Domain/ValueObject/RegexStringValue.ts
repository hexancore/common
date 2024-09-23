import { LogicError, OK, PlainParseHelper, PlainParseIssue, type PlainParseError, type R } from '../../Util';
import { AbstractValueObject, type ValueObjectType } from "./AbstractValueObject";

export type RegexStringSubtype<T> = {
  new(value: string): T;
  getRegex(): RegExp;
} & ValueObjectType;

export abstract class RegexStringValue<T extends RegexStringValue<any>> extends AbstractValueObject<T> {
  public constructor(public readonly v: string) {
    super();
  }

  public static parse<T extends RegexStringValue<any>>(this: RegexStringSubtype<T>, plain: unknown): R<T, PlainParseError> {
    const parsed = PlainParseHelper.parseStringRegex(plain, this.getRegex());
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
  public static cs<T extends RegexStringValue<any>>(this: RegexStringSubtype<T>, v: string): T {
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
