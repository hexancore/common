import { StringValue } from "./StringValue";
import { ValueObject } from "./ValueObject";

import { customAlphabet } from 'nanoid';
const RefIdGenerator = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-', 21);

/**
 * Represents unique random string id. Generates nanoid - 21 characters
 */
@ValueObject('Core')
export class RefId extends StringValue<RefId> {

  public static gen(): RefId {
    return new RefId(RefIdGenerator());
  }

}
