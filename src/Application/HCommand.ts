import {
  type HObjectType,
  type UnknownErrorType,
  type NonMethodProperties,
  type R,
  type PlainParseError,
  LogicError,
  type JsonObjectType,
  type AR,
  type ARP,
} from "../Util";

export type AnyHCommand = HCommand<any, any>;
export type HCommandType<T extends AnyHCommand> = HObjectType<T>;

export type InferHCommandResultValueType<T extends AnyHCommand> = T extends HCommand<infer U, any> ? U : never;
export type InferHCommandResultErrorType<T extends AnyHCommand> = T extends HCommand<any, infer U> ? U : never;

export type HCommandAsyncResultType<T extends AnyHCommand> = AR<InferHCommandResultValueType<T>, InferHCommandResultErrorType<T>>;
export type HCommandAsyncResultPromiseType<T extends AnyHCommand> = ARP<InferHCommandResultValueType<T>, InferHCommandResultErrorType<T>>;
export type HCommandResultType<T extends AnyHCommand> = R<InferHCommandResultValueType<T>, InferHCommandResultErrorType<T>>;

export abstract class HCommand<RT, RET extends string = UnknownErrorType> {
  /**
   * Create from safe props
   * @param this
   * @param props
   * @returns
   */
  public static cs<T extends AnyHCommand>(this: HCommandType<T>, props: NonMethodProperties<T>): T {
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
  public static parse<T extends AnyHCommand>(this: HCommandType<T>, plain: unknown): R<T, PlainParseError> {
    throw LogicError.NotImplementedOrAOTGenerated(this.constructor as any, "parse");
  }

  public toJSON(): JsonObjectType<typeof this> {
    throw LogicError.NotImplementedOrAOTGenerated(this.constructor as any, "toJSON");
  }

  /**
   * @internal Keeps inference good
   */
  protected __XHCG(): R<RT, RET> {
    return undefined as any;
  }
}