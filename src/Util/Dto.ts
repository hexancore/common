import { LogicError } from './Error';
import { type HObjectType } from './Feature/HObjectTypeMeta';
import { JsonSerialize } from './Json/JsonSerialize';
import type { PlainParseError } from './Plain';
import { type R } from './Result';
import type { JsonObjectType, NonMethodProperties } from './types';

export type DTOType<T extends DTO> = HObjectType<T>;

export abstract class DTO implements JsonSerialize {

  /**
   * Create from safe props
   * @param this
   * @param props
   * @returns
   */
  public static cs<T extends DTO>(this: DTOType<T>, props: NonMethodProperties<T>): T {
    const i = new this();
    Object.assign(i, props);
    return i;
  }

  /**
   * Creates DTO from plain object
   * @param this
   * @param plain
   * @returns
   */
  public static parse<T extends DTO>(this: DTOType<T>, plain: unknown): R<T, PlainParseError> {
    throw LogicError.NotImplementedOrAOTGenerated(this.constructor as any, "parse");
  }

  public toJSON(): JsonObjectType<this> {
    throw LogicError.NotImplementedOrAOTGenerated(this.constructor as any, "toJSON");
  }
}
