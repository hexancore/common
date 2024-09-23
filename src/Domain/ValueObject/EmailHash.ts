import { StringValue } from './StringValue';
import { hash } from 'node:crypto';
import { Email } from './Email';
import { HObjectTypeMeta } from "../../Util";

export class EmailHash extends StringValue<EmailHash> {
  public static readonly HOBJ_META = HObjectTypeMeta.domain('Core', 'Core', 'ValueObject', 'EmailHash', EmailHash);

  public static createFromEmail(email: Email): EmailHash {
    return new EmailHash(hash('sha1', email.v, "hex"));
  }
}
