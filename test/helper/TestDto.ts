import {
  UIntValue, Dto,
  type JsonObjectType,
  type PlainParsableHObjectType,
  type R, type PlainParseError,
  PlainParseHelper,
  InvalidTypePlainParseIssue,
  OK,
  HObjectTypeMeta,
  PlainParseIssue,
  TooBigPlainParseIssue,
  TooSmallPlainParseIssue,
} from "@";
import type { v } from "@/Util/Plain/types";

export class TestValueObject extends UIntValue { }

class OtherTestDto extends Dto {
  public primitiveField!: v.int.between<10, 100>;

  // generate constructor in AOT
  public constructor(
    primitiveField: number
  ) {
    super();
    this.primitiveField = primitiveField;
  }


  public static parse<T extends object>(this: PlainParsableHObjectType<T>, plain: unknown): R<T, PlainParseError> {
    // constant check part
    if (typeof plain !== 'object') {
      return PlainParseHelper.HObjectParseErr(this, [new InvalidTypePlainParseIssue('object', typeof plain)]);
    }

    const plainObj = plain as Record<keyof OtherTestDto, unknown>;
    const issues: PlainParseIssue[] = [];
    // end constant check part

    const primitiveField = PlainParseHelper.parseNumber(plainObj.primitiveField, 'primitiveField', issues);
    if (!(primitiveField instanceof PlainParseIssue)) {
      if (primitiveField < 10) {
        issues.push(TooSmallPlainParseIssue.numberGTE(10, primitiveField));
      }

      if (primitiveField > 100) {
        issues.push(TooBigPlainParseIssue.numberLTE(100, primitiveField));
      }
    }

    if (issues.length > 0) {
      return PlainParseHelper.HObjectParseErr(this, issues);
    }

    return OK(new this(
      primitiveField
    ));
  }

  public toJSON(): JsonObjectType<OtherTestDto> {
    return {
      primitiveField: this.primitiveField,
    };
  }
}

export class TestDto extends Dto {
  public static HOBJ_META = HObjectTypeMeta.application('core', 'core', 'dto', 'TestDto', TestDto);

  public constructor(
    public stringField: string,
    public bigIntField: bigint,
    public numberField: v.uint,
    public numberArrayField: number[],
    public booleanField: boolean,

    public optionalStringField?: string,
    public optionalValueObjectField?: TestValueObject,
    public optionalValueObjectArrayField?: TestValueObject[],
    public optionalDtoField?: OtherTestDto,
    public optionalDtoArrayField?: OtherTestDto[],

  ) {
    super();
  }

  public static parse<T extends object>(this: PlainParsableHObjectType<T>, plain: unknown): R<T, PlainParseError> {
    // constant check part
    if (typeof plain !== 'object') {
      return PlainParseHelper.HObjectIsNotObjectParseErr(TestDto as any, plain);
    }

    const plainObj = plain as Record<keyof TestDto, unknown>;
    const issues: PlainParseIssue[] = [];
    // end constant check part

    const stringField = PlainParseHelper.parseString(plainObj.stringField, 'stringField', issues);
    const bigIntField = PlainParseHelper.parseBigInt64(plainObj.bigIntField, 'bigIntField', issues);
    const numberField = PlainParseHelper.parseNumberGTE(plainObj.numberField, 0, 'numberField', issues);
    const numberArrayField = PlainParseHelper.parsePrimitiveArray(plainObj.numberArrayField, PlainParseHelper.parseNumber, 'numberArrayField', issues);
    const booleanField = PlainParseHelper.parseBoolean(plainObj.booleanField, 'booleanField', issues);

    let valueObjectField;
    if (plainObj.optionalValueObjectField !== undefined) {
      valueObjectField = PlainParseHelper.parseHObject(plainObj.optionalValueObjectField, TestValueObject, 'optionalValueObjectField', issues);
    }

    let optionalStringField;
    if (plainObj.optionalStringField !== undefined) {
      optionalStringField = PlainParseHelper.parseString(plainObj.optionalStringField, 'optionalStringField', issues);
    }

    let optionalValueObjectArrayField;
    if (plainObj.optionalValueObjectArrayField !== undefined) {
      optionalValueObjectArrayField = PlainParseHelper.parseHObjectArray(plainObj.optionalValueObjectArrayField, TestValueObject, 'optionalValueObjectArrayField', issues);
    }

    let optionalDtoField;
    if (plainObj.optionalDtoField !== undefined) {
      optionalDtoField = PlainParseHelper.parseHObject(plainObj.optionalDtoField, TestValueObject, 'optionalDtoField', issues);
    }

    let optionalDtoArrayField;
    if (plainObj.optionalDtoArrayField !== undefined) {
      optionalDtoArrayField = PlainParseHelper.parseHObjectArray(plainObj.optionalDtoArrayField, OtherTestDto, 'optionalDtoArrayField', issues);
    }

    if (issues.length > 0) {
      return PlainParseHelper.HObjectParseErr(this, issues);
    }

    return OK(new this(
      stringField,
      bigIntField,
      numberField,
      numberArrayField,
      booleanField,
      valueObjectField,
      optionalValueObjectArrayField,
      optionalDtoField,
      optionalDtoArrayField
    ));
  }


  public toJSON(): JsonObjectType<TestDto> {
    return {
      stringField: this.stringField,
      bigIntField: this.bigIntField.toString(),
      numberField: this.numberField,
      numberArrayField: this.numberArrayField,
      booleanField: this.booleanField,
      optionalValueObjectField: this.optionalValueObjectField?.toJSON(),
      optionalValueObjectArrayField: this.optionalValueObjectArrayField?.map(v => v.toJSON()),
      optionalDtoField: this.optionalDtoField?.toJSON(),
      optionalDtoArrayField: this.optionalDtoArrayField?.map((v) => v.toJSON()),
    };
  }
}