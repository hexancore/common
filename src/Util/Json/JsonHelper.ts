import { AppErrorCode, DefineErrorsUnion } from '../Error';
import { ERR, OK, R } from '../Result/Result';
import type { JsonObjectType } from "../types";
import type { JsonSerialize } from "./JsonSerialize";

export type JsonTraverserFn = (this: any, key: string, value: any) => any;

export const JsonErrors = {
  parse: 'core.util.json.parse',
  stringify: 'core.util.json.stringify',
} as const;
export type JsonErrors<K extends keyof typeof JsonErrors> = DefineErrorsUnion<typeof JsonErrors, K>;

export class JsonHelper {
  public static parse<T>(value: string, reviver?: JsonTraverserFn): R<T, JsonErrors<'parse'>> {
    try {
      return OK(JSON.parse(value, reviver));
    } catch (e) {
      return ERR({ type: JsonErrors.parse, code: AppErrorCode.BAD_REQUEST, error: e as any });
    }
  }

  public static stringify(value: any, replacer?: JsonTraverserFn, space?: string | number): R<string, JsonErrors<'stringify'>> {
    try {
      return OK(JSON.stringify(value, replacer, space));
    } catch (e) {
      return ERR({ type: JsonErrors.stringify, code: AppErrorCode.BAD_REQUEST, error: e as any });
    }
  }

  public static mapJsonSerializableArrayToJson<T extends JsonSerialize>(input: T[]): JsonObjectType<T>[] {
    const out: JsonObjectType<T>[] = [];
    input.forEach(v => {
      out.push(v.toJSON());
    });

    return out;
  }

  public static mapJsonSerializableMapToJson<K, V extends JsonSerialize>(input: Map<K, V>): [K, JsonObjectType<V>][] {
    const out: [K, JsonObjectType<V>][] = [];
    input.forEach((v, k) => {
      out.push([k, v.toJSON()]);
    });

    return out;
  }

  public static mapPrimitiveMapToJson<K, V>(input: Map<K, V>): [K, V][] {
    return Array.from(input.entries());
  }
}
