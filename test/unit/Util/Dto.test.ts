import { Dto, UIntValue, type JsonObjectType } from '@';
import path from 'path';

/**
 * @group unit
 */

class TestValueObject extends UIntValue { }

class OtherTestDto extends Dto {
  public constructor(
    public primitiveField?: number
  ) {
    super();
  }

  public toJSON(): JsonObjectType<this> {
    return {
      primitiveField: this.primitiveField,
    } as JsonObjectType<this>;
  }
}

class TestDto extends Dto {
  public constructor(
    public bigIntField: bigint,
    public bigIntArrayField: bigint[],
    public valueObjectField?: TestValueObject,
    public valueObjectArrayField?: TestValueObject[],
    public dtoField?: OtherTestDto,
    public dtoArrayField?: OtherTestDto[],
    public primitiveField?: number,
  ) {
    super();
  }


  public toJSON(): JsonObjectType<this> {
    return {
      primitiveField: this.primitiveField,
      bigIntField: this.bigIntField.toString(),
      bigIntArrayField: this.bigIntArrayField.map(v => v.toString()),
      valueObjectField: this.valueObjectField,
      valueObjectArrayField: this.valueObjectArrayField,
      dtoField: this.dtoField?.toJSON(),
      dtoArrayField: this.dtoArrayField?.map((v) => v.toJSON()),
    } as JsonObjectType<this>;
  }
}

describe.skip(path.basename(__filename, '.test.ts'), () => {
  test('toJSON', () => {
    const dto = TestDto.cs({
      primitiveField: 1,
      bigIntField: 1000n,
      bigIntArrayField: [2000n, 2001n],
      valueObjectField: TestValueObject.cs(2),
      valueObjectArrayField: [TestValueObject.cs(3), TestValueObject.cs(4)],
      dtoField: OtherTestDto.cs({ primitiveField: 5 }),
      dtoArrayField: [OtherTestDto.cs({ primitiveField: 6 }), OtherTestDto.cs({ primitiveField: 7 })],
    });

    const current = dto.toJSON();

    const expected = {
      bigIntArrayField: ['2000', '2001'],
      bigIntField: '1000',
      dtoArrayField: [
        {
          primitiveField: 6,
        },
        {
          primitiveField: 7,
        },
      ],
      dtoField: {
        primitiveField: 5,
      },
      primitiveField: 1,
      valueObjectArrayField: [3, 4],
      valueObjectField: 2,
    };

    expect(current).toEqual(expected);
  });
});
