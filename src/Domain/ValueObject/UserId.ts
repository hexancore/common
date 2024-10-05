import { HObjectTypeMeta } from "../../Util";
import { HString } from "./HString";

export class UserId extends HString {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject("Core", "User",  UserId);
}
