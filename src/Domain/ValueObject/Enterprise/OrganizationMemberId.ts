import { HObjectTypeMeta } from "../../../Util";
import { Uuid } from "../Uuid";

export class OrganizationMemberId extends Uuid {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject("Enterprise", "Organization", OrganizationMemberId);
}
