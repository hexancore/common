import {
  type HObjectType,
  type UnknownErrorType,
  type NonMethodProperties,
  type R,
  type PlainParseError,
  LogicError,
  type JsonObjectType
} from "../Util";


export type AnyHQuery = HQuery<any, any>;
export type HQueryType<T extends AnyHQuery> = HObjectType<T>;
export type ExtractHQueryResultValueType<T extends AnyHQuery> = T extends HQuery<any, infer U> ? U : never;

export abstract class HQuery<T extends AnyHQuery, RT, RET extends string = UnknownErrorType> {
  /**
   * Create from safe props
   * @param this
   * @param props
   * @returns
   */
  public static cs<T extends AnyHQuery>(this: HQueryType<T>, props: NonMethodProperties<T>): T {
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
  public static parse<T extends AnyHQuery>(this: HQueryType<T>, plain: unknown): R<T, PlainParseError> {
    throw new LogicError('Not implemented or AOT generated');
  }

  public toJSON(): JsonObjectType<T> {
    throw new LogicError('Not implemented or AOT generated');
  }
}