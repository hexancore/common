import { HObjectTypeMeta } from "../../../Util";
import { Uuid } from "../Uuid";

export class OrganizationId extends Uuid {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject("Enterprise", "Organization", OrganizationId);
}
