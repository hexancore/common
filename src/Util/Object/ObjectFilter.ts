import { ValueObject } from "../../Domain/ValueObject/ValueObject";
import { OK, Result, type R } from "../Result";
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
  getItems(): ReadonlyArray<T>;
}

export type ExtractObjectCollectionNames<T> = {
  [K in keyof T]: T[K] extends ObjectCollection<any> ? K : never;
}[keyof T];

export type InferCollectionItemType<C> = C extends ObjectCollection<infer U> ? U : never;

export type ObjectCollectionType<T> = Array<T> | ObjectCollection<T>;

type StringComparisonObjectPropertyFilter<T> = {
  $eq?: InferPrimitiveComparable<T>;
  $neq?: InferPrimitiveComparable<T>;
  $in?: Array<InferPrimitiveComparable<T>>;
  $nin?: Array<InferPrimitiveComparable<T>>;
  $startsWith?: string;
  $endsWith?: string;
  $contains?: string;
  $like?: string,
  $regex?: RegExp,
};

type NumberComparisonObjectPropertyFilter<T> = {
  $eq?: InferPrimitiveComparable<T>;
  $neq?: InferPrimitiveComparable<T>;
  $gt?: InferPrimitiveComparable<T>;
  $gte?: InferPrimitiveComparable<T>;
  $lt?: InferPrimitiveComparable<T>;
  $lte?: InferPrimitiveComparable<T>;
  $in?: Array<InferPrimitiveComparable<T>>;
  $nin?: Array<InferPrimitiveComparable<T>>;
};

type BigIntComparisonObjectPropertyFilter<T> = {
  $eq?: InferPrimitiveComparable<T>;
  $neq?: InferPrimitiveComparable<T>;
  $gt?: InferPrimitiveComparable<T>;
  $gte?: InferPrimitiveComparable<T>;
  $lt?: InferPrimitiveComparable<T>;
  $lte?: InferPrimitiveComparable<T>;
  $in?: Array<InferPrimitiveComparable<T>>;
  $nin?: Array<InferPrimitiveComparable<T>>;
};

type BooleanComparisonObjectPropertyFilter<T> = {
  $eq?: InferPrimitiveComparable<T>;
  $neq?: InferPrimitiveComparable<T>;
};

type CollectionComparisonObjectPropertyFilter<T> = {
  $some?: ObjectFilter<T>;
  $none?: ObjectFilter<T>;
  $every?: ObjectFilter<T>;
} | ObjectFilter<T>;

type PrimitiveCollectionComparisonObjectPropertyFilter<T> =
  T extends PrimitiveOrPrimitiveComparable<string> ? StringComparisonObjectPropertyFilter<T> :
  T extends PrimitiveOrPrimitiveComparable<number> ? NumberComparisonObjectPropertyFilter<T> :
  T extends PrimitiveOrPrimitiveComparable<bigint> ? BigIntComparisonObjectPropertyFilter<T> :
  T extends PrimitiveOrPrimitiveComparable<boolean> ? BooleanComparisonObjectPropertyFilter<T> :
  {
    $eq?: InferPrimitiveComparable<T>;
    $neq?: InferPrimitiveComparable<T>;
  };

export type ComparisonObjectPropertyFilter<T> = {
  [P in keyof T]?:
  T[P] extends PrimitiveOrPrimitiveComparable<string> ? StringComparisonObjectPropertyFilter<T[P]> :
  T[P] extends PrimitiveOrPrimitiveComparable<number> ? NumberComparisonObjectPropertyFilter<T[P]> :
  T[P] extends PrimitiveOrPrimitiveComparable<bigint> ? BigIntComparisonObjectPropertyFilter<T[P]> :
  T[P] extends PrimitiveOrPrimitiveComparable<boolean> ? BooleanComparisonObjectPropertyFilter<T[P]> :
  T[P] extends ObjectCollectionType<infer U> ? U extends object ? CollectionComparisonObjectPropertyFilter<U> :
  PrimitiveCollectionComparisonObjectPropertyFilter<U> :
  T[P] extends object ? ObjectFilter<T[P]> :
  {
    $eq?: InferPrimitiveComparable<T[P]>;
    $neq?: InferPrimitiveComparable<T[P]>;
  }
};

export type LogicalObjectFilter<T> = {
  [operator in '$and' | '$or' | '$not']?: Array<ComparisonObjectPropertyFilter<T> | LogicalObjectFilter<T>>;
};
export type ObjectFilter<T> = ComparisonObjectPropertyFilter<T> | LogicalObjectFilter<T>;

interface CheckItemFilterContext<T = any> {
  item: T;
  property: string;
  collectionsItemsCollector?: (item: T, property: string, collectionItems: any[]) => void;
  isCollection: (v) => boolean;
  getCollectionItems: (v) => any[];
}

export class ObjectFilterHelper {
  private static operatorCheckers: { [key: string]: (value: any, condValue: any, ...args: any[]) => boolean | R<boolean>; } = {
    $eq: (v, condValue, filterPath: string) => v instanceof ValueObject ? (condValue instanceof ValueObject ? v.equals(condValue) : v === condValue) : v === condValue,
    $neq: (v, condValue, filterPath: string) => !this.operatorCheckers["$eq"](v, condValue, filterPath),
    $gt: (v, condValue, filterPath: string) => v > condValue,
    $gte: (v, condValue, filterPath: string) => v >= condValue,
    $lt: (v, condValue, filterPath: string) => v < condValue,
    $lte: (v, condValue, filterPath: string) => v <= condValue,
    $in: (v, condValue, filterPath: string) => Array.isArray(condValue) && condValue.includes(v),
    $nin: (v, condValue, filterPath: string) => Array.isArray(condValue) && !condValue.includes(v),
    $startsWith: (v, condValue) => typeof v === 'string' && v.startsWith(condValue),
    $endsWith: (v, condValue) => typeof v === 'string' && v.endsWith(condValue),
    $contains: (v, condValue) => typeof v === 'string' && v.includes(condValue),
    $like: (v, condValue) => {
      if (typeof v !== 'string') return false;
      const regexPattern = condValue.replace(/%/g, '.*').replace(/_/g, '.');
      return new RegExp(`^${regexPattern}$`).test(v);
    },
    $regex: (v, condValue) => condValue instanceof RegExp && condValue.test(v),

    $every: (v, condValue, filterPath: string, options: CheckItemFilterContext) => this.every(v, condValue, filterPath + "$every.", options),
    $some: (v, condValue, filterPath: string, options: CheckItemFilterContext) => this.some(v, condValue, filterPath + "$some.", options),
    $none: (v, condValue, filterPath: string, options: CheckItemFilterContext) => this.none(v, condValue, filterPath + "$none.", options),
  };

  public static isCollection(v: any): boolean {
    return Array.isArray(v) || v.getItems;
  }

  public static getCollectionItems(v: any): any[] {
    return Array.isArray(v) ? v : v.getItems();
  }

  public static find<T>(items: T[], where: ObjectFilter<T>, options: Partial<CheckItemFilterContext<T>> = {}): R<T[]> {
    options.isCollection ??= this.isCollection;
    options.getCollectionItems ??= this.getCollectionItems;

    const found: T[] = [];
    items.forEach((item) => {
      const r = this.checkItem(item, where, ".", options as any);
      if (r.isError()) {
        return r;
      }

      if (r.v) {
        found.push(item);
      }
    });

    return OK(found);
  }

  public static findOne<T>(items: T[], where: ObjectFilter<T>, options: Partial<CheckItemFilterContext<T>> = {}): R<T | null> {
    options.isCollection ??= this.isCollection;
    options.getCollectionItems ??= this.getCollectionItems;

    items.forEach((item) => {
      const check = this.checkItem(item, where, ".", options as any);
      if (check.isError()) {
        return check;
      }

      if (check.v) {
        return item;
      }
    });

    return OK(null);
  }

  private static checkItem<T>(item: T, filter: ObjectFilter<T>, filterPath: string, context: CheckItemFilterContext): R<boolean> {
    if ("$and" in filter) {
      return this.and(item, filter.$and as any[], filterPath, context);
    }

    if ("$or" in filter) {
      const subFilters = (filter.$or as any[]);
      for (let i = 0; i < subFilters.length; ++i) {
        const r = this.checkItem(item, subFilters[i], filterPath + `$or[${i}].`, context);
        if (r.isError()) {
          return r;
        }

        if (r.v) {
          return OK(true);
        }
      }

      return OK(false);
    }

    if ('$not' in filter) {
      const subFilters = (filter.$not as any[]);
      for (let i = 0; i < subFilters.length; ++i) {
        const r = this.checkItem(item, subFilters[i], filterPath + `$not[${i}]`, context);
        if (r.isError()) {
          return r;
        }

        if (r.v) {
          return OK(false);
        }
      }

      return OK(true);
    }

    if (typeof item !== "object") {
      const r = this.evaluateCondition(item, filter, filterPath, context);
      if (r.isError() || !r.v) {
        return r;
      }
    } else {
      const subFilters = Object.entries(filter);
      for (let i = 0; i < subFilters.length; ++i) {
        const [property, subFilter] = subFilters[i];
        const value = item![property];
        let subContext = context;
        if (context.isCollection(value) && context.collectionsItemsCollector) {
          subContext = { ...context, item, property: property };
        }

        const r = this.evaluateCondition(value, subFilter, filterPath + `${property}.`, subContext);


        if (r.isError() || !r.v) {
          return r;
        }
      }
    }

    return OK(true);
  }

  private static evaluateCondition(value: any, filter: any, filterPath: string, context: CheckItemFilterContext): R<boolean> {

    if (context.isCollection(value) && (!filter.$every && !filter.$some && !filter.$none)) {
      return this.some(value, filter, filterPath, context);
    }

    const subFilters = (Object.entries(filter));
    for (let i = 0; i < subFilters.length; ++i) {
      const [operator, condValue] = subFilters[i];
      const checker = this.operatorCheckers[operator];
      let r: R<boolean> | boolean;
      if (!checker) {
        r = this.checkItem(value, filter, filterPath, context);
      } else {
        r = checker(value, condValue, filterPath, context);
      }

      if (r instanceof Result && r.isError()) {
        return r;
      }

      if ((r instanceof Result && !r.v) || !r) {
        return OK(false);
      }
    }

    return OK(true);
  }

  private static and(value: any, subFilters: ObjectFilter<any>[], filterPath: string, context: CheckItemFilterContext) {
    for (let i = 0; i < subFilters.length; ++i) {
      const r = this.checkItem(value, subFilters[i], filterPath + `$and[${i}].`, context);
      if (r.isError() || !r.v) {
        return r;
      }
    }

    return OK(true);
  }

  private static every(value: any, filter: any, filterPath: string, context: CheckItemFilterContext): R<boolean> {
    const items = context.getCollectionItems(value);
    for (let i = 0; i < items.length; ++i) {
      const r = this.checkItem(items[i], filter, filterPath + `[${i}]`, context);
      if (r.isError()) {
        return r;
      }

      if (!r.v) {
        return OK(false);
      }
    }

    if (context.collectionsItemsCollector) {
      context.collectionsItemsCollector(context.item, context.property, items);
    }
    return OK(true);
  }

  private static some(value: any, filter: any, filterPath: string, context: CheckItemFilterContext): R<boolean> {
    const items = context.getCollectionItems(value);
    let passed = false;
    for (let i = 0; i < items.length; ++i) {
      const r = this.checkItem(items[i], filter, filterPath + `[${i}]`, context);
      if (r.isError()) {
        return r;
      }

      if (r.v) {
        passed = true;
        if (context.collectionsItemsCollector) {
          context.collectionsItemsCollector(context.item, context.property, [items[i]]);
        }
      }
    }

    return OK(passed);
  }

  private static none(value: any, filter: any, filterPath: string, context: CheckItemFilterContext): R<boolean> {
    const items = context.getCollectionItems(value);
    for (let i = 0; i < items.length; ++i) {
      const r = this.checkItem(items[i], filter, filterPath + `[${i}]`, context);
      if (r.isError()) {
        return r;
      }

      if (r.v) {
        return OK(false);
      }
    }

    if (context.collectionsItemsCollector) {
      context.collectionsItemsCollector(context.item, context.property, items);
    }
    return OK(true);
  }
}
