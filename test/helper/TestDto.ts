import {
  UInt, DTO,
  type JsonObjectType,
  type R, type PlainParseError,
  PlainParseHelper,
  OK,
  HObjectTypeMeta,
  PlainParseIssue,
  TooBigPlainParseIssue,
  TooSmallPlainParseIssue,
  type DTOType,
  ArrayPlainParseHelper,
  StringPlainParseHelper,
  NumberPlainParseHelper,
} from "@";
import type { v } from "@/Util/Plain/types";

export class TestValueObject extends UInt { }

export class OtherTestDTO extends DTO {
  public primitiveField!: v.int.between<10, 100>;

  // generate constructor in AOT
  public constructor(
    primitiveField: number
  ) {
    super();
    this.primitiveField = primitiveField;
  }

  public static parse<T extends DTO>(this: DTOType<T>, plain: unknown): R<T, PlainParseError> {
    // constant check part
    if (typeof plain !== 'object') {
      return PlainParseHelper.HObjectIsNotObjectParseErr(this, plain);
    }

    const plainObj = plain as Record<keyof OtherTestDTO, unknown>;
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

  public toJSON(): JsonObjectType<this> {
    const data = {
      primitiveField: this.primitiveField,
    } as JsonObjectType<OtherTestDTO>;
    return data as any;
  }
}

export class TestDTO extends DTO {
  public static HOBJ_META = HObjectTypeMeta.application('core', 'core', 'dto', 'TestDto', TestDTO);

  public constructor(
    public stringField: string,
    public bigIntField: bigint,
    public numberField: v.uint,
    public numberArrayField: number[],
    public booleanField: boolean,

    public optionalStringField?: string,
    public optionalValueObjectField?: TestValueObject,
    public optionalValueObjectArrayField?: TestValueObject[],
    public optionalDtoField?: OtherTestDTO,
    public optionalDtoArrayField?: OtherTestDTO[],

  ) {
    super();
  }

  public static parse<T extends DTO>(this: DTOType<T>, plain: unknown): R<T, PlainParseError> {
    // constant check part
    if (typeof plain !== 'object') {
      return PlainParseHelper.HObjectIsNotObjectParseErr(TestDTO, plain);
    }

    const plainObj = plain as Record<keyof TestDTO, unknown>;
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
      optionalDtoArrayField = ArrayPlainParseHelper.parseHObjectArray(plainObj.optionalDtoArrayField, OtherTestDTO, 'optionalDtoArrayField', issues);
    }

    if (issues.length > 0) {
      return PlainParseHelper.HObjectParseErr(TestDTO, issues);
    }

    return OK(new TestDTO(
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

  public toJSON(this: TestDTO): JsonObjectType<this> {
    const data = {
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
    } as JsonObjectType<TestDTO>;

    return data as any;
  }
}

type a = ReturnType<TestDTO["toJSON"]>;

class AOTTestDTO extends DTO {
  public stringField!: string;
  public numberField!: v.uint;
}

// Uncomment to check return types
//const aotCSReturnType = AOTTestDto.cs({stringField: "test", numberField: 10});
//const aotCSReturnType = AOTTestDto.cs({stringField: "test", numberField: 10}).toJSON();
//const aotParseReturnType = AOTTestDto.parse({stringField: "test", numberField: 10});