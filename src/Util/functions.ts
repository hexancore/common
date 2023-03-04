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

export function pascalCaseToSnakeCase(s: string): string {
  return s.replace(/(?:^|\.?)([A-Z])/g, (_x, y) => '_' + y.toLowerCase()).replace(/^_/, '');
}

export function pascalCaseToCamelCase(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
