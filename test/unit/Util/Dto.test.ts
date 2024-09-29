import { OtherTestDto, TestDto, TestValueObject } from "@test/helper/TestDto";

/**
 * @group unit
 */

describe("Dto", () => {
  test("toJSON", () => {
    const dto = TestDto.cs({
      booleanField: true,
      numberArrayField: [1, 2],
      numberField: 1,
      stringField: "test",
      optionalDtoArrayField: [OtherTestDto.cs({ primitiveField: 1 })],
      optionalDtoField: OtherTestDto.cs({ primitiveField: 2 }),
      bigIntField: 1000n,
      optionalValueObjectField: TestValueObject.cs(2),
      optionalValueObjectArrayField: [TestValueObject.cs(3), TestValueObject.cs(4)],
    });

    const current = dto.toJSON();

    expect(current).toMatchSnapshot();
  });
});
