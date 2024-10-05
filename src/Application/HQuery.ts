import {
  type HObjectType,
  type UnknownErrorType,
  type NonMethodProperties,
  type R,
  type PlainParseError,
  LogicError,
  type JsonObjectType,
  type AR,
  type ARP
} from "../Util";

export type AnyHQuery = HQuery<any, any>;
export type HQueryType<T extends AnyHQuery> = HObjectType<T>;

export type InferHQueryResultValueType<T extends AnyHQuery> = T extends HQuery<infer U, any> ? U : never;
export type InferHQueryResultErrorType<T extends AnyHQuery> = T extends HQuery<any, infer U> ? U : never;

export type HQueryAsyncResultType<T extends AnyHQuery> = AR<InferHQueryResultValueType<T>, InferHQueryResultErrorType<T>>;
export type HQueryAsyncResultPromiseType<T extends AnyHQuery> = ARP<InferHQueryResultValueType<T>, InferHQueryResultErrorType<T>>;
export type HQueryResultType<T extends AnyHQuery> = R<InferHQueryResultValueType<T>, InferHQueryResultErrorType<T>>;

export abstract class HQuery<RT, RET extends string = UnknownErrorType> {
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

  public toJSON(): JsonObjectType<this> {
    throw new LogicError('Not implemented or AOT generated');
  }

  /**
   * @internal Keeps inference good
   */
  protected __XHCG(): R<RT, RET> {
    return undefined as any;
  }
}