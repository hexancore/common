import { HObjectTypeMeta } from "../../Util";
import { Uuid } from "./Uuid";

export class UserId extends Uuid {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject("User", "User",  UserId);
}
