import { HObjectTypeMeta } from "../../Util";
import { StringValue } from "./StringValue";

export class AccountId extends StringValue<AccountId> {
  public static readonly HOBJ_META = HObjectTypeMeta.domain('Core', 'Account', 'ValueObject', 'AccountId', AccountId);
}