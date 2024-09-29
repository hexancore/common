import {
  UIntValue, Dto,
  type JsonObjectType,
  type R, type PlainParseError,
  PlainParseHelper,
  OK,
  HObjectTypeMeta,
  PlainParseIssue,
  TooBigPlainParseIssue,
  TooSmallPlainParseIssue,
  type AnyDto,
  type DtoType,
  ArrayPlainParseHelper,
  StringPlainParseHelper,
  NumberPlainParseHelper,
} from "@";
import type { v } from "@/Util/Plain/types";

export class TestValueObject extends UIntValue { }

export class OtherTestDto extends Dto<OtherTestDto> {
  public primitiveField!: v.int.between<10, 100>;

  // generate constructor in AOT
  public constructor(
    primitiveField: number
  ) {
    super();
    this.primitiveField = primitiveField;
  }

  public static parse<T extends AnyDto>(this: DtoType<T>, plain: unknown): R<T, PlainParseError> {
    // constant check part
    if (typeof plain !== 'object') {
      return PlainParseHelper.HObjectIsNotObjectParseErr(this, plain);
    }

    const plainObj = plain as Record<keyof OtherTestDto, unknown>;
    const issues: PlainParseIssue[] = [];
    // end constant check part

    const primitiveField = NumberPlainParseHelper.parseNumber(plainObj.primitiveField, 'primitiveField', issues);
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

export class TestDto extends Dto<TestDto> {
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

  public static parse<T extends AnyDto>(this: DtoType<T>, plain: unknown): R<T, PlainParseError> {
    // constant check part
    if (typeof plain !== 'object') {
      return PlainParseHelper.HObjectIsNotObjectParseErr(TestDto, plain);
    }

    const plainObj = plain as Record<keyof TestDto, unknown>;
    const issues: PlainParseIssue[] = [];
    // end constant check part

    const stringField = StringPlainParseHelper.parseString(plainObj.stringField, 'stringField', issues);
    const bigIntField = PlainParseHelper.parseBigInt64(plainObj.bigIntField, 'bigIntField', issues);
    const numberField = NumberPlainParseHelper.parseNumberGTE(plainObj.numberField, 0, 'numberField', issues);
    const numberArrayField = ArrayPlainParseHelper.parsePrimitiveArray(plainObj.numberArrayField, NumberPlainParseHelper.parseNumber, 'numberArrayField', issues);
    const booleanField = PlainParseHelper.parseBoolean(plainObj.booleanField, 'booleanField', issues);

    let valueObjectField;
    if (plainObj.optionalValueObjectField !== undefined) {
      valueObjectField = PlainParseHelper.parseHObject(plainObj.optionalValueObjectField, TestValueObject, 'optionalValueObjectField', issues);
    }

    let optionalStringField;
    if (plainObj.optionalStringField !== undefined) {
      optionalStringField = StringPlainParseHelper.parseString(plainObj.optionalStringField, 'optionalStringField', issues);
    }

    let optionalValueObjectArrayField;
    if (plainObj.optionalValueObjectArrayField !== undefined) {
      optionalValueObjectArrayField = ArrayPlainParseHelper.parseHObjectArray(plainObj.optionalValueObjectArrayField, TestValueObject, 'optionalValueObjectArrayField', issues);
    }

    let optionalDtoField;
    if (plainObj.optionalDtoField !== undefined) {
      optionalDtoField = PlainParseHelper.parseHObject(plainObj.optionalDtoField, TestValueObject, 'optionalDtoField', issues);
    }

    let optionalDtoArrayField;
    if (plainObj.optionalDtoArrayField !== undefined) {
      optionalDtoArrayField = ArrayPlainParseHelper.parseHObjectArray(plainObj.optionalDtoArrayField, OtherTestDto, 'optionalDtoArrayField', issues);
    }

    if (issues.length > 0) {
      return PlainParseHelper.HObjectParseErr(TestDto, issues);
    }

    return OK(new TestDto(
      stringField as any,
      bigIntField as any,
      numberField as any,
      numberArrayField as any,
      booleanField as any,
      valueObjectField as any,
      optionalStringField as any,
      optionalValueObjectArrayField as any,
      optionalDtoField as any,
      optionalDtoArrayField as any
    )) as any;
  }


  public toJSON(): JsonObjectType<TestDto> {
    return {
      stringField: this.stringField,
      bigIntField: this.bigIntField.toString(),
      numberField: this.numberField,
      numberArrayField: this.numberArrayField,
      booleanField: this.booleanField,
      optionalStringField: this.optionalStringField,
      optionalValueObjectField: this.optionalValueObjectField?.toJSON(),
      optionalValueObjectArrayField: this.optionalValueObjectArrayField?.map(v => v.toJSON()),
      optionalDtoField: this.optionalDtoField?.toJSON(),
      optionalDtoArrayField: this.optionalDtoArrayField?.map((v) => v.toJSON()),
    };
  }
}

class AOTTestDto extends Dto<AOTTestDto> {
  public stringField!: string;
  public numberField!: v.uint;
}

// Uncomment to check return types
//const aotCSReturnType = AOTTestDto.cs({stringField: "test", numberField: 10});
//const aotParseReturnType = AOTTestDto.parse({stringField: "test", numberField: 10});