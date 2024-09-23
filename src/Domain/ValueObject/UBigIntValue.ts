import { HObjectTypeMeta, OK, PlainParseHelper, PlainParseIssue, type PlainParseError, type R } from '../../Util';
import { AbstractValueObject, type ValueObjectType } from './AbstractValueObject';

export class UBigIntValue<T extends UBigIntValue<any> = any> extends AbstractValueObject<T> {
  public static readonly HOBJ_META = HObjectTypeMeta.domain('Core', 'Core', 'ValueObject', 'UBigInt', UBigIntValue);

  public constructor(public readonly v: bigint) {
    super();
  }

  public static parse<T extends UBigIntValue>(this: ValueObjectType<T>, plain: unknown): R<T, PlainParseError> {
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
  public static cs<T extends UBigIntValue>(this: ValueObjectType<T>, v: string | number | bigint): T {
    return new (this as any)(BigInt(v));
  }

  public equals(other: T): boolean {
    return this.v === other.v;
  }

  public toString(): string {
    return this.v.toString();
  }

  public toJSON(): string {
    return this.v.toString();
  }
}
