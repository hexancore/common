import { HString } from "./HString";
import { hash } from "node:crypto";
import { Email } from "./Email";
import { HObjectTypeMeta } from "../../Util";

export class EmailHash extends HString {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject("Core", "Core", EmailHash);

  public static createFromEmail(email: Email): EmailHash {
    return new EmailHash(hash("sha1", email.v, "hex"));
  }
}
