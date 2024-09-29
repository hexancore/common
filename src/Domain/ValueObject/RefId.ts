import { HString } from "./HString";
import { customAlphabet } from 'nanoid';
import { HObjectTypeMeta } from "../../Util";

const RefIdGenerator = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-', 21);

/**
 * Represents unique random string id. Generates nanoid - 21 characters
 */
export class RefId extends HString<RefId> {
  public static readonly HOBJ_META = HObjectTypeMeta.domain('Core', 'Core', 'ValueObject', 'RefId', RefId);

  public static gen(): RefId {
    return new RefId(RefIdGenerator());
  }
}