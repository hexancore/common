import { LogicError } from "../Error";
import type { HObjectType } from "../Feature";
import type { JsonSerialize } from "../Json/JsonSerialize";
import type { PlainParseError } from "../Plain";
import type { R } from "../Result";
import type { NonMethodProperties, JsonObjectType } from "../types";


export type AnyHEvent = HEvent<any>;
export type EventType<T extends AnyHEvent> = HObjectType<T>;

export abstract class HEvent<T extends AnyHEvent> implements JsonSerialize {
  /**
   * Creates from safe props
   * @param this
   * @param props
   * @returns
   */
  public static cs<T extends AnyHEvent>(this: EventType<T>, props: NonMethodProperties<T>): T {
    const i = new this();
    Object.assign(i, props);
    return i;
  }

  /**
   * Creates from plain object
   * @param this
   * @param plain
   * @returns
   */
  public static parse<T extends AnyHEvent>(this: EventType<T>, plain: unknown): R<T, PlainParseError> {
    throw new LogicError('Not implemented or AOT generated');
  }

  public toJSON(): JsonObjectType<T> {
    throw new LogicError('Not implemented or AOT generated');
  }
}