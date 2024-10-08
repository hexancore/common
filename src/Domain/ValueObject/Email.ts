import { HObjectTypeMeta } from "../../Util";
import { EmailHash } from "./EmailHash";
import { HRegexString } from "./HRegexString";

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

export class Email extends HRegexString {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject("Core", "Core", Email);

  public static getRegex(): RegExp {
    return EMAIL_REGEX;
  }

  public get local(): string {
    return this.v.split('@', 2)[0];
  }

  public get domain(): string {
    return this.v.split('@', 2)[1];
  }

  public get hash(): EmailHash {
    return EmailHash.createFromEmail(this);
  }
}
