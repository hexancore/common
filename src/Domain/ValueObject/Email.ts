import { HObjectTypeMeta, } from "../../Util";
import { RegexString } from "./RegexString";
import { JsonSchemaFactory } from "../../Util/Json/JsonSchema";

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

export class Email extends RegexString {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject("Core", "Core", Email);
  public static readonly JSON_SCHEMA = JsonSchemaFactory.String({ format: "email" });

  public static getRegex(): RegExp {
    return EMAIL_REGEX;
  }

  public get local(): string {
    return this.v.split('@', 2)[0];
  }

  public get domain(): string {
    return this.v.split('@', 2)[1];
  }
}
