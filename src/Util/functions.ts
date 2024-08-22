import { MissingError } from './Error';

export function isIterable(obj: any): boolean {
  return typeof obj[Symbol.iterator] === 'function';
}

export function getClassMethods(obj: Record<string, any>): Array<string> {
  const properties = new Set<string>();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));

  return [...properties.keys()].filter((item: string) => typeof obj[item] === 'function');
}

export function pascalCaseToSnakeCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // "XMLHttpRequest" => 'XML_Http_Request'
    .toLowerCase();
}

export function pascalCaseToCamelCase(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function parseBoolean(value: string | undefined, defaultValue = false): boolean {
  if (value === undefined) {
    return defaultValue;
  }
  return new Boolean(parseInt(value)).valueOf();
}

export function getEnvOrError(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new MissingError(`Missing env.${name}`);
  }

  return value;
}

export function wrapToArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function wrapToIterable<T>(value: T | T[] | Iterable<T>): Iterable<T> {
  return (isIterable(value) ? value : Array.isArray(value) ? value : [value]) as any;
}

export function stripAnsiColors(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '');
}
