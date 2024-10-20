import { HString } from "./HString";
import { HObjectTypeMeta, InvalidStringPlainParseIssue, OK, PlainParseHelper, PlainParseIssue, StringPlainParseHelper, type PlainParseError, type R } from "../../Util";
import type { ValueObject, ValueObjectType } from "./ValueObject";
import { JsonSchemaFactory } from "../../Util/Json/JsonSchema";
import { v7, validate as uuidValidate } from "uuid";
import { Base36, Base62 } from "../../Util/UuidBase";

export class Uuid extends HString {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject("Core", "Core", Uuid);
  public static readonly JSON_SCHEMA = JsonSchemaFactory.String({ format: "uuid" });

  public static parse<T extends ValueObject>(this: ValueObjectType<T>, plain: unknown): R<T, PlainParseError> {
    const parsed = StringPlainParseHelper.parseStringLength(plain, 36);
    if (parsed instanceof PlainParseIssue) {
      return PlainParseHelper.HObjectParseErr(this, [InvalidStringPlainParseIssue.uuid()]);
    }

    if (!(uuidValidate(parsed))) {
      return PlainParseHelper.HObjectParseErr(this, [InvalidStringPlainParseIssue.uuid()]);
    }

    return OK(new this(parsed));
  }

  public static createFromSafeBase62<T extends Uuid>(this: ValueObjectType<T>, base62Value: string): T {
    return new this(Base62.decode(base62Value));
  }

  public static createFromSafeBase36<T extends Uuid>(this: ValueObjectType<T>, base36Value: string): T {
    return new this(Base62.decode(base36Value));
  }

  public static gen<T extends Uuid>(this: ValueObjectType<T>): T {
    return new this(v7());
  }

  public toShortString(): string {
    return this.v.replaceAll('-', '');
  }

  public toBase62(): string {
    return Base62.encode(this.v)!;
  }

  public toBase36(): string {
    return Base36.encode(this.v)!;
  }
}