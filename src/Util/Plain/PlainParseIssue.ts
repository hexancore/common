import type { HObjectTypeMeta } from "../Feature/HObjectTypeMeta";
import type { JsonSerialize } from "../Json/JsonSerialize";
import type { JsonExcluded, JsonObjectType } from "../types";

export enum PlainParseIssueCode {
  invalid_type = 'invalid_type',
  invalid_string = 'invalid_string',
  too_small = 'too_small',
  too_big = 'too_big',
  out_of_range = 'out_of_range',
  invalid_enum_value = 'invalid_enum_value',
  invalid_array_elements = 'invalid_array_elements',
  invalid_hobject = 'invalid_hobject',
  custom = 'custom',
}

export abstract class PlainParseIssue implements JsonSerialize {
  public constructor(
    public code: PlainParseIssueCode,
    public message: string,
    public path?: string
  ) {

  }

  public abstract toJSON(): JsonObjectType<object>;

  public get i18n(): string {
    return `core.plain.parse_issue.${this.code}`;
  }

  public isInvalidType(): this is InvalidTypePlainParseIssue {
    return this.code === PlainParseIssueCode.invalid_type;
  }

  public isInvalidString(): this is InvalidStringPlainParseIssue {
    return this.code === PlainParseIssueCode.invalid_string;
  }

  public isTooSmall(): this is TooSmallPlainParseIssue {
    return this.code === PlainParseIssueCode.too_small;
  }

  public isTooBig(): this is TooBigPlainParseIssue {
    return this.code === PlainParseIssueCode.too_big;
  }

  public isInvalidEnumValue(): this is InvalidEnumValuePlainParseIssue {
    return this.code === PlainParseIssueCode.invalid_enum_value;
  }

  public isInvalidArrayElements(): this is InvalidArrayElementsPlainParseIssue {
    return this.code === PlainParseIssueCode.invalid_array_elements;
  }

  public isInvalidHObject(): this is InvalidHObjectPlainParseIssue {
    return this.code === PlainParseIssueCode.invalid_hobject;
  }

  public isCustom(): this is CustomPlainParseIssue {
    return this.code === PlainParseIssueCode.custom;
  }
}

export type PlainParsePrimitiveType = 'string' | 'number' | 'int' | 'uint' | 'bigint' | 'bigint_string' | "uint64_string" | 'boolean' | 'object' | 'array' | 'symbol' | 'undefined' | 'null' | 'function' | 'Date';

export class InvalidTypePlainParseIssue extends PlainParseIssue {
  public constructor(
    public expected: PlainParsePrimitiveType | PlainParsePrimitiveType[],
    public received: PlainParsePrimitiveType,
    path?: string,
  ) {
    super(PlainParseIssueCode.invalid_type, `Expected value type: '${Array.isArray(expected) ? expected.join(' | ') : expected}', received: '${received}'`, path);
  }

  public toJSON(): JsonObjectType<InvalidTypePlainParseIssue> {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      expected: this.expected,
      received: this.received,
      i18n: this.i18n
    };
  }
}

export class InvalidStringPlainParseIssue extends PlainParseIssue {
  public constructor(
    public validatorType: string,
    public validatorArgs: Record<string, any>,
    message: string,
    path?: string,
  ) {
    super(PlainParseIssueCode.invalid_string, message, path);
  }

  public static uuid(path?: string): InvalidStringPlainParseIssue {
    return new this('uuid', { }, "String must be UUID", path);
  }

  public static regex(regex: RegExp, path?: string): InvalidStringPlainParseIssue {
    const message = `String must pass pattern: ${regex}`;
    return new this('regex', { regex }, message, path);
  }

  public get i18n(): string {
    return super.i18n + `.${this.validatorType}`;
  }

  public toJSON(): JsonObjectType<InvalidStringPlainParseIssue> {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      validatorType: this.validatorType,
      validatorArgs: this.validatorArgs,
      i18n: this.i18n,
    } as any;
  }
}

export enum ValueRangeSideMode {
  bigint_exclusively = 'bigint_exclusively',
  bigint_inclusively = 'bigint_inclusively',
  bigint_exactly = 'bigint_exactly',

  number_exclusively = 'number_exclusively',
  number_inclusively = 'number_inclusively',
  number_exactly = 'number_exactly',

  array_size_exactly = 'array_size_exactly',
  array_size_inclusively = 'array_size_inclusively',

  string_len_exactly = 'string_len_exactly',
  string_len_inclusively = 'string_len_inclusively',
}

export class OutOfRangePlainParseIssue extends PlainParseIssue {
  public constructor(
    public min: number | bigint,
    public max: number | bigint,
    public valueType: "array" | "number",
    public inclusively: boolean,
    public current: number | bigint,
    message: string,
    path?: string
  ) {
    super(PlainParseIssueCode.out_of_range, message, path);
  }

  public static arrayBetween(min: number, max: number, current: number, path?: string): OutOfRangePlainParseIssue {
    const message = `Array size must be between ${min} and ${max} inclusively, current: ${current}`;
    return new this(min, max, "array", true, current, message, path);
  }

  public static stringLengthBetween(min: number, max: number, current: number, path?: string): OutOfRangePlainParseIssue {
    const message = `String length must be between ${min} and ${max} inclusively, current: ${current}`;
    return new this(min, max, "number", true, current, message, path);
  }

  public static numberBetween(min: number, max: number, current: number, path?: string): OutOfRangePlainParseIssue {
    const message = `Number must be between ${min} and ${max} inclusively, current: ${current}`;
    return new this(min, max, "number", true, current, message, path);
  }

  public static numberBetweenExclusively(min: number, max: number, current: number, path?: string): OutOfRangePlainParseIssue {
    const message = `Number must be between ${min} and ${max} exclusively, current: ${current}`;
    return new this(min, max, "number", false, current, message, path);
  }



  public get i18n(): string {
    return super.i18n + `.${this.valueType}.${this.inclusively ? "inclusively" : "exclusively"}`;
  }

  public toJSON(): JsonObjectType<OutOfRangePlainParseIssue> {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      i18n: this.i18n,

      min: typeof this.min === 'bigint' ? this.min.toString() : this.min,
      max: typeof this.max === 'bigint' ? this.max.toString() : this.max,
      valueType: this.valueType,
      inclusively: this.inclusively,
      current: typeof this.current === 'bigint' ? this.current.toString() : this.current,
    };
  }
}

export class TooSmallPlainParseIssue extends PlainParseIssue {
  public constructor(
    public min: number | bigint,
    public mode: ValueRangeSideMode,
    public current: number | bigint,
    message: string,
    path?: string
  ) {
    super(PlainParseIssueCode.too_small, message, path);
  }

  public static arrayExactlySize(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `Array must contain exactly ${minimum} element(s), current: ${current}`;
    return new this(minimum, ValueRangeSideMode.array_size_exactly, current, message, path);
  }

  public static arrayAtLeastSize(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `Array must contain at least ${minimum} element(s), current: ${current}`;
    return new this(minimum, ValueRangeSideMode.array_size_inclusively, current, message, path);
  }

  public static stringLengthExactly(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `String must contain exactly ${minimum} character(s), current: ${current}`;
    return new this(minimum, ValueRangeSideMode.string_len_exactly, current, message, path);
  }

  public static stringLengthAtLeast(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `String must contain at least ${minimum} character(s), current: ${current}`;
    return new this(minimum, ValueRangeSideMode.string_len_inclusively, current, message, path);
  }

  public static numberGTE(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `Number must be greater than or equal to ${minimum}, current: ${current}`;
    return new this(minimum, ValueRangeSideMode.number_inclusively, current, message, path);
  }

  public static numberGT(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `Number must be greater than ${minimum}, current: ${current}`;
    return new this(minimum, ValueRangeSideMode.number_exclusively, current, message, path);
  }

  public static numberExactly(exactly: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `Number must be exactly ${exactly}, current: ${current}`;
    return new this(exactly, ValueRangeSideMode.number_exactly, current, message, path);
  }

  public static bigintGTE(minimum: bigint, current: bigint, path?: string): TooSmallPlainParseIssue {
    const message = `Number must be greater than or equal to ${minimum}, current: ${current}`;
    return new this(minimum, ValueRangeSideMode.bigint_inclusively, current, message, path);
  }

  public get i18n(): string {
    return super.i18n + `.${this.mode}`;
  }

  public toJSON(): JsonObjectType<TooSmallPlainParseIssue> {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      i18n: this.i18n,

      min: typeof this.min === 'bigint' ? this.min.toString() : this.min,
      mode: this.mode,
      current: typeof this.current === 'bigint' ? this.current.toString() : this.current,
    };
  }
}

export class TooBigPlainParseIssue extends PlainParseIssue {
  public constructor(
    public max: number,
    public mode: ValueRangeSideMode,
    public current: number,
    message: string,
    path?: string,
    public minimum?: number,
  ) {
    super(PlainParseIssueCode.too_big, message, path);
  }

  public static arrayExactlySize(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = `Array must contain exactly ${maximum} element(s), current: ${current}`;
    return new this(maximum, ValueRangeSideMode.array_size_exactly, current, message, path);
  }

  public static arrayMaxSize(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = `Array must contain maximum ${maximum} element(s), current: ${current}`;
    return new this(maximum, ValueRangeSideMode.array_size_inclusively, current, message, path);
  }

  public static stringLengthExactly(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = `String must contain exactly ${maximum} character(s), current: ${current}`;
    return new this(maximum, ValueRangeSideMode.string_len_exactly, current, message, path);
  }

  public static stringLengthMax(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = `String must contain maximum ${maximum} character(s), current: ${current}`;
    return new this(maximum, ValueRangeSideMode.string_len_inclusively, current, message, path);
  }

  public static numberLTE(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = `Number must be less than or equal to ${maximum}, current: ${current}`;
    return new this(maximum, ValueRangeSideMode.number_inclusively, current, message, path);
  }

  public static numberLT(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = `Number must be less than ${maximum}, current: ${current}`;
    return new this(maximum, ValueRangeSideMode.number_exclusively, current, message, path);
  }

  public static numberExactly(exactly: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = ` Number must be exactly ${exactly}, current: ${current}`;
    return new this(exactly, ValueRangeSideMode.number_exactly, current, message, path);
  }

  public toJSON(): JsonObjectType<TooBigPlainParseIssue> {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      i18n: this.i18n,

      max: this.max,
      mode: this.mode,
      current: this.current,
    };
  }
}

export class InvalidEnumValuePlainParseIssue extends PlainParseIssue {
  public constructor(
    public options: (string | number)[],
    public received: string | number,
    path?: string
  ) {
    const optionsString = options.map(o => `'${o}'`).join('|');
    super(PlainParseIssueCode.invalid_enum_value, `Invalid enum value. Expected ${optionsString}, received '${received}'`, path);
  }

  public toJSON(): JsonObjectType<InvalidEnumValuePlainParseIssue> {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      i18n: this.i18n,

      options: this.options,
      received: this.received,
    };
  }
}


export class InvalidArrayElementsPlainParseIssue extends PlainParseIssue {
  public constructor(
    public issues: PlainParseIssue[],
    path?: string
  ) {
    super(PlainParseIssueCode.invalid_array_elements, 'Invalid array elements', path);
  }

  public toJSON(): JsonObjectType<InvalidArrayElementsPlainParseIssue> {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      i18n: this.i18n,

      issues: this.issues.map(v => v.toJSON() as any),
    };
  }
}

export class InvalidHObjectPlainParseIssue extends PlainParseIssue {
  public constructor(
    public typeMeta: HObjectTypeMeta & JsonExcluded,
    public issues: PlainParseIssue[],
    path?: string
  ) {
    super(PlainParseIssueCode.invalid_hobject, `Invalid plain object to parse to HObject: ${typeMeta.typeId}`, path);
  }

  public toJSON(): JsonObjectType<InvalidHObjectPlainParseIssue> & { typeId: string; } {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      i18n: this.i18n,
      typeId: this.typeMeta.typeId,
      issues: this.issues.map(v => v.toJSON() as any),
    };
  }
}

export class CustomPlainParseIssue<DT = any> extends PlainParseIssue {
  public constructor(
    public details: DT,
    message: string,
    path?: string
  ) {
    super(PlainParseIssueCode.custom, message, path);
  }

  public toJSON(): JsonObjectType<CustomPlainParseIssue> {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      i18n: this.i18n,
      details: this.details
    };
  }
}

export type PlainParseIssueType =
  | InvalidTypePlainParseIssue
  | InvalidStringPlainParseIssue
  | TooSmallPlainParseIssue
  | TooBigPlainParseIssue
  | InvalidEnumValuePlainParseIssue
  | InvalidArrayElementsPlainParseIssue
  | InvalidHObjectPlainParseIssue
  | CustomPlainParseIssue;