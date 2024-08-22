import type { HObjectTypeMeta } from "../Feature";
import type { JsonSerialize } from "../Json/JsonSerialize";
import type { JsonExcluded, JsonObjectType } from "../types";


export enum PlainParseIssueCode {
  invalid_type = 'invalid_type',
  invalid_string = 'invalid_string',
  too_small = 'too_small',
  too_big = 'too_big',
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

export type PlainParsePrimitiveType = 'string' | 'number' | 'bigint' | 'bigint_string' | 'boolean' | 'object' | 'array' | 'symbol' | 'undefined' | 'null' | 'function';

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
    message: string,
    path?: string,
  ) {
    super(PlainParseIssueCode.invalid_string, message, path);
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
      i18n: this.i18n
    };
  }
}

export enum ValueRangeSideMode {
  number_exclusive = 'number_exclusive',
  number_inclusive = 'number_inclusive',
  number_exactly = 'number_exactly',

  array_exactly_size = 'array_exactly_size',
  array_inclusive_size = 'array_inclusive_size',

  string_exactly_len = 'string_exactly_len',
  string_inclusive_len = 'string_inclusive_len',
}

export class TooSmallPlainParseIssue extends PlainParseIssue {
  public constructor(
    public minimum: number,
    public mode: ValueRangeSideMode,
    public current: number,
    message: string,
    path?: string
  ) {
    super(PlainParseIssueCode.too_small, message, path);
  }

  public static arrayExactlySize(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `Array must contain exactly ${minimum} element(s), current: ${current}`;
    return new this(minimum, ValueRangeSideMode.array_exactly_size, current, message, path);
  }

  public static arrayAtLeastSize(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `Array must contain at least ${minimum} element(s), current: ${current}`;
    return new this(minimum, ValueRangeSideMode.array_inclusive_size, current, message, path);
  }

  public static stringExactlyLen(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `String must contain exactly ${minimum} character(s), current: ${current}`;
    return new this(minimum, ValueRangeSideMode.string_exactly_len, current, message, path);
  }

  public static stringAtLeastLen(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `String must contain at least ${minimum} character(s), current: ${current}`;
    return new this(minimum, ValueRangeSideMode.string_inclusive_len, current, message, path);
  }

  public static numberGTE(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `Number must be greater than or equal to ${minimum}, current: ${current}`;
    return new this(minimum, ValueRangeSideMode.number_inclusive, current, message, path);
  }

  public static numberGT(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `Number must be greater than ${minimum}, current: ${current}`;
    return new this(minimum, ValueRangeSideMode.number_exclusive, current, message, path);
  }

  public static numberExactly(minimum: number, current: number, path?: string): TooSmallPlainParseIssue {
    const message = `Number must be exactly ${minimum}, current: ${current}`;
    return new this(minimum, ValueRangeSideMode.number_exactly, current, message, path);
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

      minimum: this.minimum,
      mode: this.mode,
      current: this.current,
    };
  }
}

export class TooBigPlainParseIssue extends PlainParseIssue {
  public constructor(
    public maximum: number,
    public mode: ValueRangeSideMode,
    public current: number,
    message: string,
    path?: string
  ) {
    super(PlainParseIssueCode.too_small, message, path);
  }

  public static arrayExactlySize(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = `Array must contain exactly ${maximum} element(s), current: ${current}`;
    return new this(maximum, ValueRangeSideMode.array_exactly_size, current, message, path);
  }

  public static arrayAtLeastSize(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = `Array must contain at least ${maximum} element(s), current: ${current}`;
    return new this(maximum, ValueRangeSideMode.array_inclusive_size, current, message, path);
  }

  public static stringExactlyLen(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = `String must contain exactly ${maximum} character(s), current: ${current}`;
    return new this(maximum, ValueRangeSideMode.string_exactly_len, current, message, path);
  }

  public static stringAtLeastLen(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = `String must contain maximum ${maximum} character(s), current: ${current}`;
    return new this(maximum, ValueRangeSideMode.string_inclusive_len, current, message, path);
  }

  public static numberLTE(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = `Number must be less than or equal to ${maximum}, current: ${current}`;
    return new this(maximum, ValueRangeSideMode.number_inclusive, current, message, path);
  }

  public static numberLT(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = `Number must be less than ${maximum}, current: ${current}`;
    return new this(maximum, ValueRangeSideMode.number_exclusive, current, message, path);
  }

  public static numberExactly(maximum: number, current: number, path?: string): TooBigPlainParseIssue {
    const message = ` Number must be exactly ${maximum}, current: ${current}`;
    return new this(maximum, ValueRangeSideMode.number_exactly, current, message, path);
  }

  public toJSON(): JsonObjectType<TooBigPlainParseIssue> {
    return {
      code: this.code,
      message: this.message,
      path: this.path,
      i18n: this.i18n,

      maximum: this.maximum,
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
    super(PlainParseIssueCode.invalid_array_elements, `Invalid enum value. Expected ${optionsString}, received '${received}'`, path);
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
    super(PlainParseIssueCode.invalid_hobject, `Invalid object of type: ${typeMeta.typeId}`, path);
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