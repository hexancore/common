import { HObjectTypeMeta, OK, PlainParseError, PlainParseHelper, StringPlainParseHelper, PlainParseIssue, type R } from "../../Util";
import { HValueObject, type ValueObjectType } from "./HValueObject";

export class HString extends HValueObject {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject('Core', 'Core', HString);

  public constructor(public readonly v: string) {
    super();
  }

  public static parse<T extends HValueObject>(this: ValueObjectType<T>, plain: unknown): R<T, PlainParseError> {
    const parsed = StringPlainParseHelper.parseString(plain);
    if (parsed instanceof PlainParseIssue) {
      return PlainParseHelper.HObjectParseErr(this, [parsed]);
    }

    return OK(new this(parsed));
  }

  /**
   * Creates instance without extra validation.
   * @param v
   * @returns
   */
  public static cs<T extends HString>(this: ValueObjectType<T>, v: string): T {
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

