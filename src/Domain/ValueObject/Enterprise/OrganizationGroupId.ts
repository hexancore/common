import { HObjectTypeMeta } from "../../../Util";
import { Uuid } from "../Uuid";

export class OrganizationGroupId extends Uuid {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject("Enterprise", "OrganizationGroupId", OrganizationGroupId);
}
