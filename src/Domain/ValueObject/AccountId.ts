import { HObjectTypeMeta } from "../../Util";
import { HString } from "./HString";

export class AccountId extends HString<AccountId> {
  public static readonly HOBJ_META = HObjectTypeMeta.domain('Core', 'Account', 'ValueObject', 'AccountId', AccountId);
}