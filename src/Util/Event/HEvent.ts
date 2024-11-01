import { LogicError } from "../Error";
import type { HObjectType } from "../Feature/HObjectTypeMeta";
import type { JsonSerialize } from "../Json/JsonSerialize";
import type { PlainParseError } from "../Plain";
import type { R } from "../Result";
import type { NonMethodProperties, JsonObjectType } from "../types";



export type EventType<T extends HEvent> = HObjectType<T>;

export abstract class HEvent implements JsonSerialize {
  /**
   * Creates from safe props
   * @param this
   * @param props
   * @returns
   */
  public static cs<T extends HEvent>(this: EventType<T>, props: NonMethodProperties<T>): T {
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
  public static parse<T extends HEvent>(this: EventType<T>, plain: unknown): R<T, PlainParseError> {
    throw LogicError.NotImplementedOrAOTGenerated(this.constructor as any, "parse");
  }

  public toJSON(): JsonObjectType<this> {
    throw LogicError.NotImplementedOrAOTGenerated(this.constructor as any, "toJSON");
  }
}