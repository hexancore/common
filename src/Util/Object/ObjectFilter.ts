import type { InferPrimitiveComparable, PrimitiveOrPrimitiveComparable } from "../types";

// MongoDB-like operators
export const ObjectFilterOperators = {
  // EQUAL
  eq: '$eq',
  neq: '$ne',

  // MATH
  gt: '$gt',
  gte: '$gte',
  lt: '$lt',
  lte: '$lte',

  // IN ARRAY
  in: '$in',
  nin: '$nin',

  // STRING
  startsWith: '$startsWith',
  endsWith: '$endsWith',
  contains: '$contains',
  like: '$like',
  regex: '$regex',

  // LOGICAL
  and: '$and',
  or: '$or',
  not: '$not',

  // COLLECTION
  some: '$some',
  none: '$none',
  every: '$every',
} as const;
export type ObjectFilterOperator = typeof ObjectFilterOperators[keyof typeof ObjectFilterOperators];

export interface ObjectCollection<T> {

}
export type ObjectCollectionType<T> = Array<T> | ObjectCollection<T>;

export type ComparisonObjectPropertyFilter<T> = {
  [P in keyof T]?:
  T[P] extends PrimitiveOrPrimitiveComparable<string> ? {
    $eq?: InferPrimitiveComparable<T[P]>;
    $neq?: InferPrimitiveComparable<T[P]>;
    $in?: Array<InferPrimitiveComparable<T[P]>>;
    $nin?: Array<InferPrimitiveComparable<T[P]>>;
    $startsWith?: string;
    $endsWith?: string;
    $contains?: string;
    $like?: string,
    $regex?: RegExp,
  } :
  T[P] extends PrimitiveOrPrimitiveComparable<number> ? {
    $eq?: InferPrimitiveComparable<T[P]>;
    $neq?: InferPrimitiveComparable<T[P]>;
    $gt?: InferPrimitiveComparable<T[P]>;
    $gte?: InferPrimitiveComparable<T[P]>;
    $lt?: InferPrimitiveComparable<T[P]>;
    $lte?: InferPrimitiveComparable<T[P]>;
    $in?: Array<InferPrimitiveComparable<T[P]>>;
    $nin?: Array<InferPrimitiveComparable<T[P]>>;
  } :
  T[P] extends PrimitiveOrPrimitiveComparable<bigint> ? {
    $eq?: InferPrimitiveComparable<T[P]>;
    $neq?: InferPrimitiveComparable<T[P]>;
    $gt?: InferPrimitiveComparable<T[P]>;
    $gte?: InferPrimitiveComparable<T[P]>;
    $lt?: InferPrimitiveComparable<T[P]>;
    $lte?: InferPrimitiveComparable<T[P]>;
    $in?: Array<InferPrimitiveComparable<T[P]>>;
    $nin?: Array<InferPrimitiveComparable<T[P]>>;
  } :
  T[P] extends PrimitiveOrPrimitiveComparable<boolean> ? {
    $eq?: InferPrimitiveComparable<T[P]>;
    $neq?: InferPrimitiveComparable<T[P]>;
  } :
  T[P] extends ObjectCollectionType<infer U> ? U extends object ? {
    $some?: ObjectFilter<U>;
    $none?: ObjectFilter<U>;
    $every?: ObjectFilter<U>;
  } :
  T[P] extends object ? ComparisonObjectPropertyFilter<T[P]> | {
    $eq?: InferPrimitiveComparable<T[P]>;
    $neq?: InferPrimitiveComparable<T[P]>;
  } :
  {
    $eq?: InferPrimitiveComparable<T[P]>;
    $neq?: InferPrimitiveComparable<T[P]>;
  } :
  {
    $eq?: InferPrimitiveComparable<T[P]>;
    $neq?: InferPrimitiveComparable<T[P]>;
  }
};

export type LogicalObjectFilter<T> = {
  [operator in '$and' | '$or' | '$not']?: Array<ComparisonObjectPropertyFilter<T> | LogicalObjectFilter<T>>;
};
export type ObjectFilter<T> = ComparisonObjectPropertyFilter<T> | LogicalObjectFilter<T>;
