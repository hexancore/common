import { HObjectTypeMeta } from "../../Util";
import { StringValue } from "./StringValue";

export class UserId extends StringValue<UserId> {
  public static readonly HOBJ_META = HObjectTypeMeta.domain('Core', 'User', 'ValueObject', 'UserId', UserId);
}
