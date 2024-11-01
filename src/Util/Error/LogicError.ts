export class LogicError extends Error {

  public static NotImplementedOrAOTGenerated(classConstructor: new (...args: any[]) => any, method: string): LogicError {
    return new LogicError(`${classConstructor.name}.${method}() Not implemented or AOT generated`);
  }
}