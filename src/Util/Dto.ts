import { LogicError } from './Error';
import { type HObjectType } from './Feature/HObjectTypeMeta';
import { JsonSerialize } from './Json/JsonSerialize';
import type { PlainParseError } from './Plain';
import { type R } from './Result';
import type { JsonObjectType, NonMethodProperties } from './types';

export type DtoType<T extends Dto> = HObjectType<T>;

export abstract class Dto implements JsonSerialize {

  /**
   * Create from safe props
   * @param this
   * @param props
   * @returns
   */
  public static cs<T extends Dto>(this: DtoType<T>, props: NonMethodProperties<T>): T {
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
  public static parse<T extends Dto>(this: DtoType<T>, plain: unknown): R<T, PlainParseError> {
    throw new LogicError('Not implemented or AOT generated');
  }

  public toJSON(): JsonObjectType<this> {
    throw new LogicError('Not implemented or AOT generated');
  }
}
