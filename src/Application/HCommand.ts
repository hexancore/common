import {
  type HObjectType,
  type UnknownErrorType,
  type NonMethodProperties,
  type R,
  type PlainParseError,
  LogicError,
  type JsonObjectType
} from "../Util";

export type AnyHCommand = HCommand<any, any>;
export type HCommandType<T extends AnyHCommand> = HObjectType<T>;
export type ExtractHCommandResultValueType<T extends AnyHCommand> = T extends HCommand<any, infer U> ? U : never;

export abstract class HCommand<T extends AnyHCommand, RT, RET extends string = UnknownErrorType> {
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
    throw new LogicError('Not implemented or AOT generated');
  }

  public toJSON(): JsonObjectType<T> {
    throw new LogicError('Not implemented or AOT generated');
  }
}