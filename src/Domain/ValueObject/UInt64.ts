import { HObjectTypeMeta, OK, PlainParseHelper, PlainParseIssue, type PlainParseError, type R } from '../../Util';
import { ValueObject, type ValueObjectType } from './ValueObject';
import { JsonSchemaFactory } from "../../Util/Json/JsonSchema";

export class UInt64 extends ValueObject {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject('Core', 'Core', UInt64);
  public static readonly JSON_SCHEMA = JsonSchemaFactory.String({ pattern: "^(0|[1-9]\\d{0,19})$" });

  public constructor(public readonly v: bigint) {
    super();
  }

  public static parse<T extends ValueObject>(this: ValueObjectType<T>, plain: unknown): R<T, PlainParseError> {
    const parsed = PlainParseHelper.parseUInt64(plain);
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
  public static cs<T extends UInt64>(this: ValueObjectType<T>, v: string | number | bigint): T {
    return new this(BigInt(v));
  }

  public equals(other: this): boolean {
    return this.v === other.v;
  }

  public toString(): string {
    return this.v.toString();
  }

  public toJSON(): string {
    return this.v.toString();
  }
}
