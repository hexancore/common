import { Bench } from 'tinybench';

import {
  Dto,
  type JsonObjectType,
  type R, type PlainParseError,
  PlainParseHelper,
  NumberPlainParseHelper,
  StringPlainParseHelper,
  ArrayPlainParseHelper,
  IntegerPlainParseHelper,
  InvalidTypePlainParseIssue,
  PlainParseIssue,
  OK,
  HObjectTypeMeta,
  TooBigPlainParseIssue,
  RefId,
  v,
  DtoType,
  UInt
} from "@hexancore/common";

import { z } from 'zod';

export class TestValueObject extends UInt {
  public static readonly HOBJ_META = HObjectTypeMeta.application('core', 'core', 'value_object', 'Test', TestValueObject);
}

class OtherTestDto extends Dto {

  public static readonly HOBJ_META = HObjectTypeMeta.application('core', 'core', 'dto', 'OtherTest', OtherTestDto);
  public constructor(
    public primitiveField?: number
  ) {
    super();
  }

  // AOT generated example
  public static parse<T extends Dto>(this: DtoType<T>, plain: unknown): R<T, PlainParseError> {
    // constant check part
    if (typeof plain !== 'object') {
      return PlainParseHelper.HObjectParseErr(this, [new InvalidTypePlainParseIssue('object', typeof plain)]);
    }

    const plainObj = plain as Record<keyof OtherTestDto, unknown>;
    const issues: PlainParseIssue[] = [];
    // end constant check part

    const primitiveField = NumberPlainParseHelper.parseNumber(plainObj.primitiveField, 'primitiveField', issues);
    if (!(primitiveField instanceof PlainParseIssue) && primitiveField > 2000) {
      issues.push(TooBigPlainParseIssue.numberLT(2000, primitiveField));
    }

    if (issues.length > 0) {
      return PlainParseHelper.HObjectParseErr(this, issues);
    }

    return OK(new this(
      primitiveField
    ));
  }

  public toJSON(): JsonObjectType<this> {
    return {
      primitiveField: this.primitiveField,
    };
  }
}

export class TestDto extends Dto {

  public static readonly HOBJ_META = HObjectTypeMeta.application('Core', 'Core', 'Dto', 'Test', TestDto);

  public constructor(
    public bigIntField: bigint,
    public numberField: number,
    public numberArrayField: number[],
    public booleanField: boolean,
    public unionField: number | boolean | string,

    public optionalValueObjectField?: TestValueObject,
    public optionalValueObjectArrayField?: TestValueObject[],
    public optionalDtoField?: OtherTestDto,
    public optionalDtoArrayField?: OtherTestDto[],
  ) {
    super();
  }

  // AOT generated example
  public static parse<T extends Dto>(this: DtoType<T>, plain: unknown): R<T, PlainParseError> {
    // constant check part
    if (typeof plain !== 'object') {
      return PlainParseHelper.HObjectIsNotObjectParseErr(TestDto as any, plain);
    }

    const p = plain as Record<keyof TestDto, unknown>;
    const issues: PlainParseIssue[] = [];
    // end constant check part


    const bigIntField = PlainParseHelper.parseBigInt64(p.bigIntField, 'bigIntField', issues);
    const numberField = NumberPlainParseHelper.parseNumberLT(p.numberField, 2000, 'numberField', issues);

    const numberArrayField = ArrayPlainParseHelper.parsePrimitiveArray(p.numberArrayField, NumberPlainParseHelper.parseNumber, 'numberArrayField', issues);
    const booleanField = PlainParseHelper.parseBoolean(p.booleanField, 'booleanField', issues);

    let valueObjectField;
    if (p.optionalValueObjectField !== undefined) {
      valueObjectField = PlainParseHelper.parseHObject(p.optionalValueObjectField, TestValueObject, 'optionalValueObjectField', issues);
    }

    let optionalValueObjectArrayField;
    if (p.optionalValueObjectArrayField) {
      optionalValueObjectArrayField = ArrayPlainParseHelper.parseHObjectArray(p.optionalValueObjectArrayField, TestValueObject, 'optionalValueObjectArrayField', issues);
    }

    let optionalDtoField;
    if (p.optionalDtoField !== undefined) {
      optionalDtoField = PlainParseHelper.parseHObject(p.optionalDtoField, OtherTestDto, 'optionalDtoField', issues);
    }

    let optionalDtoArrayField;
    if (p.optionalDtoArrayField !== undefined) {
      optionalDtoArrayField = ArrayPlainParseHelper.parseHObjectArray(p.optionalDtoArrayField, OtherTestDto, 'optionalDtoArrayField', issues);
    }

    let unionField;
    switch (typeof p.unionField) {
      case 'number':
        unionField = p.unionField;
        break;
      case 'boolean':
        unionField = p.unionField;
        break;
      case 'string':
        unionField = p.unionField;
        break;
    }
    if (unionField === undefined) {
      issues.push(new InvalidTypePlainParseIssue(['number', 'boolean', 'string'], typeof p.unionField, 'unionField'));
    }

    if (issues.length > 0) {
      return PlainParseHelper.HObjectParseErr(TestDto as any, issues);
    }

    return OK(new this(
      bigIntField,
      numberField,
      numberArrayField,
      booleanField,
      unionField,
      valueObjectField,
      optionalValueObjectArrayField,
      optionalDtoField,
      optionalDtoArrayField
    ));
  }


  // AOT generated example
  public toJSON(): JsonObjectType<this> {
    const data: JsonObjectType<TestDto> = {
      bigIntField: this.bigIntField.toString(),
      numberField: this.numberField,
      numberArrayField: this.numberArrayField,
      booleanField: this.booleanField,
      unionField: this.unionField,
      optionalValueObjectField: this.optionalValueObjectField?.toJSON(),
      optionalValueObjectArrayField: this.optionalValueObjectArrayField?.map(v => v.toJSON()),
      optionalDtoField: this.optionalDtoField?.toJSON(),
      optionalDtoArrayField: this.optionalDtoArrayField?.map((v) => v.toJSON()),
    };

    return data as any;
  }
}

export class SmallTestDto extends Dto {

  public static readonly HOBJ_META = HObjectTypeMeta.application('core', 'core', 'dto', 'SmallTestDto', TestDto);

  public constructor(
    public stringField: string,
    public numberField: number,
    public numberArrayField: number[],
    public booleanField: boolean,
    public valueObjectField: RefId,
  ) {
    super();
  }

  // AOT generated example
  public static parse<T extends Dto>(this: DtoType<T>, plain: unknown): R<T, PlainParseError> {
    // constant check part
    if (typeof plain !== 'object') {
      return PlainParseHelper.HObjectIsNotObjectParseErr(SmallTestDto, plain);
    }

    const p = plain as Record<keyof SmallTestDto, unknown>;
    const issues: PlainParseIssue[] = [];
    // end constant check part


    const stringField = StringPlainParseHelper.parseString(p.stringField, 'stringField', issues);
    const numberField = NumberPlainParseHelper.parseNumberLT(p.numberField, 2000, 'numberField', issues);

    const numberArrayField = ArrayPlainParseHelper.parsePrimitiveArray(p.numberArrayField, NumberPlainParseHelper.parseNumber, 'numberArrayField', issues);
    const booleanField = PlainParseHelper.parseBoolean(p.booleanField, 'booleanField', issues);

    const valueObjectField = PlainParseHelper.parseHObject(p.valueObjectField, TestValueObject, 'optionalValueObjectField', issues);

    return OK(new SmallTestDto(
      stringField as any,
      numberField as any,
      numberArrayField as any,
      booleanField as any,
      valueObjectField as any,
    )) as any;
  }


  // AOT generated example
  public toJSON(): JsonObjectType<this> {
    const data: JsonObjectType<SmallTestDto> = {
      stringField: this.stringField,
      numberField: this.numberField,
      numberArrayField: this.numberArrayField,
      booleanField: this.booleanField,
      valueObjectField: this.valueObjectField?.toJSON(),
    };
    return data as any;
  }
}

class TestTransformDto extends Dto {
  public static readonly HOBJ_META = HObjectTypeMeta.application("Book", "Book", "Dto", "TestTransformDto", TestTransformDto);
  public optionalField?: string;
  public numberField!: number;
  public stringField!: string;
  public booleanField!: boolean;
  public bigintField!: bigint;
  public primitiveArrayField!: string[];
  public uintField!: v.uint;
  public ruleWithArgsField!: v.int.between<-10, 100>;
  public ruleArrayField!: v.int.between<-10, 100>[];
  //public ruleArrayWithItemsField!: v.int.between<-10, 100>[] & v.items.between<2, 5>;
  public hObjField!: RefId;
  public optionalHObjField?: RefId;
  public hObjArrayField!: RefId[];

  public constructor(numberField: any, stringField: any, booleanField: any, bigintField: any, primitiveArrayField: any, uintField: any, ruleWithArgsField: any, ruleArrayField: any, hObjField: any, hObjArrayField: any, optionalField?: any, optionalHObjField?: any) {
    super();
    this.numberField = numberField;
    this.stringField = stringField;
    this.booleanField = booleanField;
    this.bigintField = bigintField;
    this.primitiveArrayField = primitiveArrayField;
    this.uintField = uintField;
    this.ruleWithArgsField = ruleWithArgsField;
    this.ruleArrayField = ruleArrayField;
    this.hObjField = hObjField;
    this.hObjArrayField = hObjArrayField;
    this.optionalField = optionalField;
    this.optionalHObjField = optionalHObjField;
  }
  public static parse<T extends Dto>(this: DtoType<T>, plain: unknown): R<T, PlainParseError> {
    if (typeof plain !== "object") {
      return PlainParseHelper.HObjectIsNotObjectParseErr(TestTransformDto as any, plain);
    }
    const p = plain as Record<keyof TestTransformDto, unknown>;
    const issues: PlainParseIssue[] = [];
    let optionalField;
    if (p.optionalField !== undefined) {
      optionalField = StringPlainParseHelper.parseString(p.optionalField, "optionalField", issues);
    }
    const numberField = NumberPlainParseHelper.parseNumber(p.numberField, "numberField", issues);
    const stringField = StringPlainParseHelper.parseString(p.stringField, "stringField", issues);
    const booleanField = PlainParseHelper.parseBoolean(p.booleanField, "booleanField", issues);
    const bigintField = PlainParseHelper.parseBigInt64(p.bigintField, "bigintField", issues);
    const primitiveArrayField = ArrayPlainParseHelper.parsePrimitiveArray(p.primitiveArrayField, pi => StringPlainParseHelper.parseString(pi), "primitiveArrayField", issues);
    const uintField = IntegerPlainParseHelper.parseUInt(p.uintField, "uintField", issues);
    const ruleWithArgsField = IntegerPlainParseHelper.parseIntBetween(p.ruleWithArgsField, -10, 100, "ruleWithArgsField", issues);
    const ruleArrayField = ArrayPlainParseHelper.parsePrimitiveArray(p.ruleArrayField, pi => IntegerPlainParseHelper.parseIntBetween(pi, -10, 100), "ruleArrayField", issues);
    const hObjField = PlainParseHelper.parseHObject(p.hObjField, RefId, "hObjField", issues);
    let optionalHObjField;
    if (p.optionalHObjField !== undefined) {
      optionalHObjField = PlainParseHelper.parseHObject(p.optionalHObjField, RefId, "optionalHObjField", issues);
    }
    const hObjArrayField = ArrayPlainParseHelper.parseHObjectArray(p.hObjArrayField, RefId, "hObjArrayField", issues);
    if (issues.length > 0) {
      return PlainParseHelper.HObjectParseErr(TestTransformDto as any, issues);
    }
    return OK(new TestTransformDto(optionalField as any, numberField as any, stringField as any, booleanField as any, bigintField as any, primitiveArrayField as any, uintField as any, ruleWithArgsField as any, ruleArrayField as any, hObjField as any, optionalHObjField as any, hObjArrayField as any)) as any;
  }
  public toJSON(): JsonObjectType<this> {
    const data: JsonObjectType<TestTransformDto> = {
      optionalField: this.optionalField,
      numberField: this.numberField,
      stringField: this.stringField,
      booleanField: this.booleanField,
      bigintField: this.bigintField.toString(),
      primitiveArrayField: this.primitiveArrayField,
      uintField: this.uintField,
      ruleWithArgsField: this.ruleWithArgsField,
      ruleArrayField: this.ruleArrayField,
      hObjField: this.hObjField.toJSON(),
      optionalHObjField: this.optionalHObjField?.toJSON(),
      hObjArrayField: this.hObjArrayField.map(item => item.toJSON())
    };
    return data as any;
  }
}

const plain2 = {
  "bigintField": "10",
  "booleanField": true,
  "hObjArrayField": [
    "test_1",
    "test_2",
  ],
  "hObjField": "test",
  "numberField": 1,
  "optionalField": "test_optionalStringField",
  "optionalHObjField": "test_1",
  "primitiveArrayField": [
    "test1",
    "test2",
  ],
  "ruleArrayField": [
    -5,
    50,
  ],
  "ruleWithArgsField": -5,
  "stringField": "test_stringField",
  "uintField": 100,
};


const plain: JsonObjectType<TestDto> = {
  bigIntField: '1000',

  numberField: 1000,
  numberArrayField: [1000],

  booleanField: true,
  unionField: 'super',

  optionalValueObjectField: 1000,
  optionalValueObjectArrayField: [1000, 2000, 3000],

  optionalDtoField: {
    primitiveField: 1000
  },
  optionalDtoArrayField: [{ primitiveField: 1000 }, { primitiveField: 2000 }]
};

const smallPlain: JsonObjectType<SmallTestDto> = {
  stringField: 'test_string',
  numberField: 1000,
  numberArrayField: [1000],
  booleanField: true,
  valueObjectField: '1000',
};

const invalidSmallPlain: JsonObjectType<SmallTestDto> | any = {
  stringField: 1008,
  numberField: 1000,
  numberArrayField: [1000],
  booleanField: "fog",
  valueObjectField: '1000',
};

const zodSmallNoExtraClassesTestDtoSchema = z.object({
  stringField: z.string(),
  numberField: z.number(),
  numberArrayField: z.array(z.number()),
  booleanField: z.boolean(),
  valueObjectField: z.string(),
});

const invalidPlain: JsonObjectType<TestDto> | any = {
  bigIntField: '1000',

  numberField: 'fff',
  numberArrayField: [1000],

  booleanField: true,

  optionalValueObjectField: 1000,
  optionalValueObjectArrayField: [1000, 2000, 3000],

  optionalDtoField: {
    primitiveField: 'not_number'
  },
  optionalDtoArrayField: [{ primitiveField: 1000 }, { primitiveField: 'not_number' }]
};


const zodOtherTestDtoSchema = z.object({
  primitiveField: z.number().max(2000).optional(),
}).transform((v) => new OtherTestDto(v.primitiveField));

const zodTestDtoSchema = z.object({
  bigIntField: z.string().regex(/^-?\d{1,19}$/).transform((v) => BigInt(v)),
  numberField: z.number().max(2000),
  numberArrayField: z.array(z.number()),
  booleanField: z.boolean(),
  unionField: z.union([z.number(), z.boolean(), z.string()]),
  optionalDtoField: zodOtherTestDtoSchema.optional(),
  optionalValueObjectField: z.number().optional().transform((v) => v ? new TestValueObject(v) : undefined),
  optionalValueObjectArrayField: z.array(z.number().transform((v) => v ? new TestValueObject(v) : undefined)).optional(),
  optionalDtoArrayField: z.array(zodOtherTestDtoSchema).optional(),
});

const zodNoTransformOtherTestDtoSchema = z.object({
  primitiveField: z.number().max(2000),
});

const zodNoTransformTestDtoSchema = z.object({
  bigIntField: z.string().regex(/^-?\d{1,19}$/).transform((v) => BigInt(v)),
  numberField: z.number().max(2000),
  numberArrayField: z.array(z.number()),
  booleanField: z.boolean(),
  unionField: z.union([z.number(), z.boolean(), z.string()]),
  optionalDtoField: zodNoTransformOtherTestDtoSchema.optional(),
  optionalValueObjectField: z.number().optional(),
  optionalValueObjectArrayField: z.array(z.number()).optional(),
  optionalDtoArrayField: z.array(zodOtherTestDtoSchema).optional(),
});

const bench = new Bench({ time: 3000, iterations: 8, warmupTime: 500 });

bench
  .add('Small HObject.parse() - valid plain', () => {
    const obj = SmallTestDto.parse(smallPlain);
    if (obj.isError()) {
      throw new Error("imposible");
    }
  })
  .add('Small HObject.parse() - invalid plain', () => {
    const obj = SmallTestDto.parse(invalidSmallPlain);
  })

  .add('Small Zod(Pure) - valid plain', () => {
    const obj = zodSmallNoExtraClassesTestDtoSchema.parse(smallPlain);
  })

  .add('Small Zod(Pure) - invalid plain', () => {
    try {
      const obj = zodSmallNoExtraClassesTestDtoSchema.parse(invalidSmallPlain);
      // eslint-disable-next-line no-empty
    } catch (e) {
    }
  })

  .add('HObject.parse - valid plain', () => {
    const obj = TestTransformDto.parse(plain2);
    if (obj.isError()) {
      throw new Error("imposible");
    }
  })
  .add('Zod - with-transforms - valid plain', () => {
    try {
      const obj = TestDto.cs(zodTestDtoSchema.parse(plain) as any);
    } catch (e) {
      throw e;
    }
  })
  .add('HObject.parse - invalid plain', () => {
    const obj = TestDto.parse(invalidPlain);
  })
  .add('Zod - with-transforms - invalid plain', () => {
    try {
      const obj = TestDto.cs(zodTestDtoSchema.parse(invalidPlain) as any);
    } catch (e) {

    }
  })
  .add('Zod - no-transforms - valid plain', () => {
    try {
      const obj = zodNoTransformTestDtoSchema.parse(plain);
    } catch (e) {

    }
  })
  .add('Zod - no-transforms - invalid plain', () => {
    try {
      const obj = zodNoTransformTestDtoSchema.parse(invalidPlain);
    } catch (e) {

    }
  });

//bench.threshold = 10
//bench.concurrency = "task"

await bench.warmup();
await bench.run();

console.table(bench.table());