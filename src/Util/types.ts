/* eslint-disable @typescript-eslint/ban-types */

export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

/**
 * Removes last tuple element.
 */
export type Head<T extends any[]> = T extends [...infer Head, any] ? Head : any[];

export type DropLastParam<F extends (...args: any) => any> = Head<Parameters<F>>;

/**
 * Returs Tuple without first item.
 */
export type DropFirstItem<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;

/**
 * Returns tuple without N first items.
 */
export type TupleTail<T extends any[], N extends number, R extends any[] = []> = R['length'] extends N
  ? T
  : TupleTail<DropFirstItem<T>, N, [any, ...R]>;

export type ParamsTail<T extends (...args: any) => any, N extends number> = TupleTail<Parameters<T>, N>;

export type FilterNotStartsWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? never : Set;
export type FilterStartsWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? Set : never;
export type StripPrefix<T extends string, prefix extends string> = T extends `${prefix}${infer Prefix}` ? Prefix : never;

export type ExtractIterableType<T extends Iterable<any>> = T extends Iterable<infer U> ? U : T;

export type HasAnyRequiredProperty<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T] extends never ? false : true;

export type OneOrIterable<T> = T | Iterable<T>;

export type OrderDirection = 'ASC' | 'DESC';

export type EnumValueOrString<T> = T extends keyof T ? T[keyof T] & string : T;

export type EnumValue<T> = (T[keyof T] & number) | string;

export type EnumObject<T> = {
  [k: number]: string;
  [k: string]: EnumValue<T>;
};

export type TUNKNOWN = '#U';
export type ExcludeUnknown<T> = Exclude<T, TUNKNOWN>;
export type CastVoidToUnknownMarker<U> = U extends void ? TUNKNOWN : U;

export type CastToIterable<T, IT = any> = T extends Iterable<IT> ? T : never;

export type ExtractKeyof<U, K> = K extends keyof U ? K : never;
