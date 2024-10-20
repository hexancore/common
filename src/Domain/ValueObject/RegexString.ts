import { LogicError, OK, StringPlainParseHelper, PlainParseHelper, PlainParseIssue, type PlainParseError, type R, type JsonSchema } from '../../Util';
import { ValueObject, type ValueObjectType } from "./ValueObject";
import { JsonSchemaFactory } from "../../Util/Json/JsonSchema";

export abstract class RegexString extends ValueObject {
  public constructor(public readonly v: string) {
    super();
  }

  public static parse<T extends ValueObject>(this: ValueObjectType<T> & { getRegex(): RegExp; }, plain: unknown): R<T, PlainParseError> {
    const parsed = StringPlainParseHelper.parseStringRegex(plain, this.getRegex());
    if (parsed instanceof PlainParseIssue) {
      return PlainParseHelper.HObjectParseErr(this, [parsed]);
    }

    return OK(new this(parsed));
  }

  public static get JSON_SCHEMA(): JsonSchema {
    return JsonSchemaFactory.String({ pattern: this.getRegex().toString() });
  }

  public static getRegex(): RegExp {
    throw new LogicError("Must be implemented in value object class");
  }

  /**
   * Creates instance without extra validation.
   * @param v
   * @returns
   */
  public static cs<T extends RegexString>(this: ValueObjectType<T>, v: string): T {
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