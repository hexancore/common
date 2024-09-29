import { LogicError } from './Error';
import { HObjectType, type HObjectTypeMeta } from './Feature/HObjectTypeMeta';
import { JsonSerialize } from './Json/JsonSerialize';
import type { PlainParseError } from './Plain';
import { type R } from './Result';
import type { JsonObjectType, NonMethodProperties } from './types';

export type AnyDto = Dto<any>;
export type DtoType<T extends AnyDto> = HObjectType<T>;

export abstract class Dto<T extends AnyDto> implements JsonSerialize {

  /**
   * Create from safe props
   * @param this
   * @param props
   * @returns
   */
  public static cs<T extends AnyDto>(this: DtoType<T>, props: NonMethodProperties<T>): T {
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
  public static parse<T extends AnyDto>(this: DtoType<T>, plain: unknown): R<T, PlainParseError> {
    throw new LogicError('Not implemented or AOT generated');
  }

  public toJSON(): JsonObjectType<T> {
    throw new LogicError('Not implemented or AOT generated');
  }
}
