import { HObjectTypeMeta } from "../../Util";
import { HString } from "./HString";

export class AccountId extends HString {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject('Core', 'Account', AccountId);
}