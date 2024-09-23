import { HObjectTypeMeta, OK, PlainParseError, PlainParseHelper, PlainParseIssue, type R } from "../../Util";
import { AbstractValueObject, type ValueObjectType } from "./AbstractValueObject";

export class StringValue<T extends StringValue<any> = any> extends AbstractValueObject<T> {
  public static readonly HOBJ_META = HObjectTypeMeta.domain('Core', 'Core', 'ValueObject', 'String', StringValue);


  public constructor(public readonly v: string) {
    super();
  }

  public static parse<T extends StringValue>(this: ValueObjectType<T>, plain: unknown): R<T, PlainParseError> {
    const parsed = PlainParseHelper.parseString(plain);
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
  public static cs<T extends StringValue>(this: ValueObjectType<T>, v: string): T {
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

