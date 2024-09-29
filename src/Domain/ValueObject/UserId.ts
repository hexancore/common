import { HObjectTypeMeta } from "../../Util";
import { HString } from "./HString";

export class UserId extends HString<UserId> {
  public static readonly HOBJ_META = HObjectTypeMeta.domain('Core', 'User', 'ValueObject', 'UserId', UserId);
}
