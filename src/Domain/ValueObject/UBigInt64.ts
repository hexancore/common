import { HObjectTypeMeta, OK, PlainParseHelper, PlainParseIssue, type PlainParseError, type R } from '../../Util';
import { HValueObject, type ValueObjectType } from './HValueObject';

export class UBigInt64 extends HValueObject {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject('Core', 'Core', UBigInt64);

  public constructor(public readonly v: bigint) {
    super();
  }

  public static parse<T extends HValueObject>(this: ValueObjectType<T>, plain: unknown): R<T, PlainParseError> {
    const parsed = PlainParseHelper.parseBigInt64GTE(plain, 0n);
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
  public static cs<T extends UBigInt64>(this: ValueObjectType<T>, v: string | number | bigint): T {
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
