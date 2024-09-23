import { HObjectTypeMeta, InvalidTypePlainParseIssue, OK, PlainParseHelper, TooSmallPlainParseIssue, type PlainParseError, type R } from '../../Util';
import { AbstractValueObject, type ValueObjectType } from './AbstractValueObject';

export class UIntValue<T extends UIntValue<any> = any> extends AbstractValueObject<T> {
  public static readonly HOBJ_META = HObjectTypeMeta.domain('Core', 'User', 'ValueObject', 'UInt', UIntValue);

  public constructor(public readonly v: number) {
    super();
  }

  public static parse<T extends UIntValue>(this: ValueObjectType<T>, plain: unknown): R<T, PlainParseError> {
    let parsed: number;
    switch (typeof plain) {
      case 'number':
        parsed = Math.trunc(plain);
        break;
      case 'string':
        parsed = parseInt(plain);
        break;
      default:
        return PlainParseHelper.HObjectParseErr(this, [new InvalidTypePlainParseIssue('number', typeof plain)]);
    }

    if (parsed < 0) {
      const issue = TooSmallPlainParseIssue.numberGTE(0, parsed);
      return PlainParseHelper.HObjectParseErr(this, [issue]);
    }

    return OK(new this(parsed));
  }

  /**
   * Creates instance without extra validation.
   * @param v
   * @returns
   */
  public static cs<T extends UIntValue>(this: ValueObjectType<T>, v: string | number): T {
    if (typeof v === 'string') {
      v = Number.parseInt(v);
    }

    return new this(v);
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
