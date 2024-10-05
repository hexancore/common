import { HObjectTypeMeta, IntegerPlainParseHelper, OK, PlainParseHelper, type PlainParseError, type R } from '../../Util';
import { HValueObject, type ValueObjectType } from './HValueObject';

export class UInt extends HValueObject {
  public static readonly HOBJ_META = HObjectTypeMeta.domain('Core', 'User', 'ValueObject', 'UInt', UInt);

  public constructor(public readonly v: number) {
    super();
  }

  public static parse<T extends HValueObject>(this: ValueObjectType<T>, plain: unknown): R<T, PlainParseError> {
    const parsed = IntegerPlainParseHelper.parseUInt(plain);
    return typeof parsed === "number" ? OK(new this(parsed)) : PlainParseHelper.HObjectParseErr(this, [parsed]);
  }

  /**
   * Creates instance without extra validation.
   * @param v
   * @returns
   */
  public static cs<T extends UInt>(this: ValueObjectType<T>, v: string | number): T {
    if (typeof v === 'string') {
      v = Number.parseInt(v);
    }

    return new this(v);
  }

  public equals(other: this): boolean {
    return this.v === other.v;
  }

  public toString(): string {
    return this.v.toString();
  }

  public toJSON(): number {
    return this.v;
  }
}