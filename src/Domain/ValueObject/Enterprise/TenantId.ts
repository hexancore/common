import { HObjectTypeMeta } from "../../../Util";
import { Uuid } from "../Uuid";

export class TenantId extends Uuid {
  public static readonly HOBJ_META = HObjectTypeMeta.ValueObject("Enterprise", "Tenant", TenantId);
}
