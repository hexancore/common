import { RawErrorEnum, EnumErrorTypeWrapper, pascalCaseToSnakeCase } from '../Util';

/**
 * Extract errors
 */
type ApplicationErrors<T extends RawErrorEnum> = {
  readonly [P in keyof T]: EnumErrorTypeWrapper & string;
};

/**
 *
 * @param errorsClass instance of local class
 * @returns Object with error type property wrappers.
 */
export function DefineApplicationErrors<T extends RawErrorEnum>(errorsClass: T): ApplicationErrors<T> {
  const module = pascalCaseToSnakeCase(errorsClass.constructor.name);
  const moduleErrorTypePrefix = module + '.application.';
  const errors: any = {};

  Object.getOwnPropertyNames(errorsClass).forEach((name) => {
    errors[name] = new EnumErrorTypeWrapper(moduleErrorTypePrefix + name);
  });

  return errors;
}
