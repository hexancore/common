import { Bench } from 'tinybench';

import {
  ValueObject,
  UIntValue, Dto,
  type JsonObjectType,
  type PlainParsableHObjectType,
  type R, type PlainParseError,
  PlainParseHelper,
  InvalidTypePlainParseIssue,
  PlainParseIssue,
  OK,
  HObjectTypeMeta,
  TooBigPlainParseIssue,
} from "@hexancore/common";

import { union, z } from 'zod';

@ValueObject('Test')
export class TestValueObject extends UIntValue {
  public static HOBJ_META = HObjectTypeMeta.application('core', 'core', 'value_object', 'Test', TestValueObject);
}

class OtherTestDto extends Dto {

  public static HOBJ_META = HObjectTypeMeta.application('core', 'core', 'dto', 'OtherTest', OtherTestDto);
  public constructor(
    public primitiveField?: number
  ) {
    super();
  }

  // AOT generated example
  public static parse<T extends object>(this: PlainParsableHObjectType<T>, plain: unknown): R<T, PlainParseError> {
    // constant check part
    if (typeof plain !== 'object') {
      return PlainParseHelper.HObjectParseErr(this, [new InvalidTypePlainParseIssue('object', typeof plain)]);
    }

    const plainObj = plain as Record<keyof OtherTestDto, unknown>;
    const issues: PlainParseIssue[] = [];
    // end constant check part

    const primitiveField = PlainParseHelper.parseNumber(plainObj.primitiveField, 'primitiveField', issues);
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

  public toJSON(): JsonObjectType<OtherTestDto> {
    return {
      primitiveField: this.primitiveField,
    };
  }
}

export class TestDto extends Dto {

  public static HOBJ_META = HObjectTypeMeta.application('core', 'core', 'dto', 'Test', TestDto);

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
  public static parse<T extends object>(this: PlainParsableHObjectType<T>, plain: unknown): R<T, PlainParseError> {
    // constant check part
    if (typeof plain !== 'object') {
      return PlainParseHelper.HObjectIsNotObjectParseErr(TestDto as any, plain);
    }

    const p = plain as Record<keyof TestDto, unknown>;
    const issues: PlainParseIssue[] = [];
    // end constant check part


    const bigIntField = PlainParseHelper.parseBigInt64(p.bigIntField, 'bigIntField', issues);
    const numberField = PlainParseHelper.parseNumberLT(p.numberField, 2000, 'numberField', issues);

    const numberArrayField = PlainParseHelper.parsePrimitiveArray(p.numberArrayField, PlainParseHelper.parseNumber, 'numberArrayField', issues);
    const booleanField = PlainParseHelper.parseBoolean(p.booleanField, 'booleanField', issues);

    let valueObjectField;
    if (p.optionalValueObjectField !== undefined) {
      valueObjectField = PlainParseHelper.parseHObject(p.optionalValueObjectField, TestValueObject, 'optionalValueObjectField', issues);
    }

    let optionalValueObjectArrayField;
    if (p.optionalValueObjectArrayField) {
      optionalValueObjectArrayField = PlainParseHelper.parseHObjectArray(p.optionalValueObjectArrayField, TestValueObject, 'optionalValueObjectArrayField', issues);
    }

    let optionalDtoField;
    if (p.optionalDtoField !== undefined) {
      optionalDtoField = PlainParseHelper.parseHObject(p.optionalDtoField, OtherTestDto, 'optionalDtoField', issues);
    }

    let optionalDtoArrayField;
    if (p.optionalDtoArrayField !== undefined) {
      optionalDtoArrayField = PlainParseHelper.parseHObjectArray(p.optionalDtoArrayField, OtherTestDto, 'optionalDtoArrayField', issues);
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
      return PlainParseHelper.HObjectParseErr(TestDto, issues);
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
  public toJSON(): JsonObjectType<TestDto> {
    return {
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
  }
}

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

type a = z.infer<typeof zodOtherTestDtoSchema>;

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

const bench = new Bench({ time: 3000, iterations: 12, warmupTime: 500 });

bench
  .add('HObject.parse - valid plain', () => {
    const obj = TestDto.parse(plain);
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
    if (obj.isError()) {

    }
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