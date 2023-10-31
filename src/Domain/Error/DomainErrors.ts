import {
  AR,
  ERR,
  ERRA,
  FilterNotStartsWith,
  FilterStartsWith,
  R,
  StripPrefix,
  EnumErrorTypeWrapper,
  pascalCaseToSnakeCase,
  RawErrorEnum,
} from '../../Util';

export type standard_entity_errors = 'duplicate' | 'not_found';

export class EnumEntityErrorTypeWrapper<EntityErrorTypes> {
  public constructor(private readonly typePrefix: string) {}
  public err<T>(type: EntityErrorTypes, data?: any | (() => any)): R<T> {
    return ERR(this.t(type), this.code(type), data);
  }

  public erra<T>(type: EntityErrorTypes, data?: any | (() => any)): AR<T> {
    return ERRA(this.t(type), this.code(type), data);
  }

  public code(type: EntityErrorTypes): number {
    return (type as any) == 'not_found' ? 404 : 400;
  }

  public t(type: EntityErrorTypes): string {
    return (this.typePrefix + '.' + type) as unknown as string;
  }
}

/**
 * Type for entity error types proper IDE hinting
 */
export type EntityErrorTypes<T> = {
  readonly [P in FilterStartsWith<keyof T, 'entity_'> as StripPrefix<P, 'entity_'>]: EnumEntityErrorTypeWrapper<T[P]>;
};

/**
 * Type for entity error types group proper IDE hinting
 */
export type EntityErrorType<T extends RawErrorEnum> = {
  readonly entity: EntityErrorTypes<T>;
};

/**
 * Extract errors other then entity error
 */
type DomainErrorTypes<T extends RawErrorEnum, Filter extends string = 'entity_'> = {
  readonly [P in FilterNotStartsWith<keyof T, Filter>]: EnumErrorTypeWrapper & string;
};

export type DomainErrors<T> = DomainErrorTypes<T> & EntityErrorType<T>;

/**
 *
 * @param obj instance of local class
 * @returns Object with error type property wrappers.
 */

export function DefineDomainErrors<T>(module: string, obj: T): DomainErrors<T> {
  module = pascalCaseToSnakeCase(module);
  const moduleErrorTypePrefix = module + '.domain.';
  const moduleEntityErrorTypePrefix = moduleErrorTypePrefix + 'entity.';
  const errors: any = {
    entity: {},
  };

  Object.getOwnPropertyNames(obj).forEach((name) => {
    if (name.startsWith('entity_')) {
      const entityType = name.substring(7);
      errors.entity[entityType] = new EnumEntityErrorTypeWrapper(moduleEntityErrorTypePrefix + entityType);
    } else {
      errors[name] = new EnumErrorTypeWrapper(moduleErrorTypePrefix + name);
    }
  });

  return errors;
}
