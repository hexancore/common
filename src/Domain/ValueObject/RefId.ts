import { HString } from "./HString";
import { customAlphabet } from "nanoid";
import { HObjectTypeMeta, OK, PlainParseHelper, PlainParseIssue, StringPlainParseHelper, type PlainParseError, type R } from "../../Util";
import type { ValueObject, ValueObjectType } from "./ValueObject";
import { JsonSchemaFactory } from "../../Util/Json/JsonSchema";

export const REF_ID_LENGTH = 21;
const RefIdGenerator = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-', REF_ID_LENGTH);

/**
 * Represents unique random string id. Generates nanoid - REF_ID_LENGTH characters
 */
export class RefId extends HString {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject("Core", "Core", RefId);
  public static readonly JSON_SCHEMA = JsonSchemaFactory.String({ minLength: REF_ID_LENGTH, maxLength: REF_ID_LENGTH });

  public static parse<T extends ValueObject>(this: ValueObjectType<T>, plain: unknown): R<T, PlainParseError> {
    const parsed = StringPlainParseHelper.parseStringLength(plain, REF_ID_LENGTH);
    if (parsed instanceof PlainParseIssue) {
      return PlainParseHelper.HObjectParseErr(this, [parsed]);
    }

    return OK(new this(parsed));
  }

  public static gen(): RefId {
    return new RefId(RefIdGenerator());
  }
}