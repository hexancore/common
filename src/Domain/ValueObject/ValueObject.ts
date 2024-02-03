import { AppError, ERR, JsonSerialize, pascalCaseToSnakeCase, Result } from '../../Util';

export interface ValueObjectMeta {
  readonly module: string;
  readonly class: string;
}

export const VALUE_OBJECT_META_PROPERTY = '__VOMETA';

export type AnyValueObject = AbstractValueObject<any>;

export type ValueObjectConstructor<T extends AnyValueObject = AnyValueObject> = new (...args: any[]) => T;

/**
 * Decorator
 * @param moduleName Name of module
 */
export function ValueObject<T extends AnyValueObject>(moduleName: string): (constructor: ValueObjectConstructor<T>) => void {
  return function (constructor: ValueObjectConstructor) {
    constructor.prototype[VALUE_OBJECT_META_PROPERTY] = {
      module: moduleName,
      class: constructor.name,
    };
  };
}

export function ValueObjectInvalidRawValueError(meta: ValueObjectMeta, data: any = null): AppError {
  return new AppError({
    type: pascalCaseToSnakeCase(meta.module) + '.domain.value_object.' + pascalCaseToSnakeCase(meta.class) + '.invalid_raw_value',
    data,
    code: 400,
  });
}

export function checkEnumValueObject(value: any, enumType: any, meta: ValueObjectMeta, data: any = null): AppError | null {
  if (!(value in enumType)) {
    return ValueObjectInvalidRawValueError(meta, data);
  }
  return null;
}

export abstract class AbstractValueObject<T extends AnyValueObject> implements JsonSerialize {
  /**
   * @deprecated use invalidRaw
   * @param meta
   * @param data
   * @returns
   */
  protected static createInvalidRawValueError(meta: ValueObjectMeta, data: any = null): AppError {
    return ValueObjectInvalidRawValueError(this.prototype[VALUE_OBJECT_META_PROPERTY], data);
  }

  protected static invalidRaw<R>(valueObjectClass: any, data: any = null): Result<R> {
    const meta = valueObjectClass.prototype[VALUE_OBJECT_META_PROPERTY];
    if (!meta) {
      throw new Error(VALUE_OBJECT_META_PROPERTY + " property isn't defined, add @ValueObject decorator to " + valueObjectClass.name);
    }
    return ERR(ValueObjectInvalidRawValueError(meta, data));
  }

  public abstract equals(o: T): boolean;
  public abstract toString(): string;
  public abstract toJSON(): any;
}
