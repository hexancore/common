import { InvalidHObjectPlainParseIssue, InvalidMapEntriesPlainParseIssue, InvalidMapEntryPlainParseIssue, InvalidTypePlainParseIssue, NumberPlainParseHelper, StringPlainParseHelper } from "@";
import { MapPlainParseHelper } from "@/Util/Plain/MapPlainParseHelper";
import { OtherTestDTO } from "@test/helper/TestDto";
import path from "node:path";

/**
 * @group unit
 */

describe(path.basename(__filename, ".test.ts"), () => {
  describe("parsePrimitiveMap", () => {
    test("when valid", () => {
      const entries: [string, number][] = [["key_1", 1], ["key_2", 2]];

      const current = MapPlainParseHelper.parsePrimitiveMap(entries, StringPlainParseHelper.parseString, NumberPlainParseHelper.parseNumber);

      expect(current).toEqual(new Map(entries));

    });

    test("when invalid type", () => {
      const entries: unknown = 100;

      const issues = [];
      const current = MapPlainParseHelper.parsePrimitiveMap(entries, StringPlainParseHelper.parseString, NumberPlainParseHelper.parseNumber, "map", issues);

      expect(issues).toEqual([current]);
      expect(current).toEqual(new InvalidTypePlainParseIssue("map_entries", "number", "map"));
    });

    test("when missing entry value", () => {
      const entries: unknown = [["key_1"], ["key_2", 2]];

      const issues = [];
      const current = MapPlainParseHelper.parsePrimitiveMap(entries, StringPlainParseHelper.parseString, NumberPlainParseHelper.parseNumber, "map", issues);

      expect(issues).toEqual([current]);
      expect(current).toEqual(new InvalidMapEntriesPlainParseIssue([
        new InvalidTypePlainParseIssue("map_entry", "array", "0")
      ], "map"));
    });

    test("when missing entry key", () => {
      const entries: unknown = [[1], ["key_2", 2]];

      const issues = [];
      const current = MapPlainParseHelper.parsePrimitiveMap(entries, StringPlainParseHelper.parseString, NumberPlainParseHelper.parseNumber, "map", issues);

      expect(issues).toEqual([current]);
      expect(current).toEqual(new InvalidMapEntriesPlainParseIssue([
        new InvalidTypePlainParseIssue("map_entry", "array", "0")
      ], "map"));
    });

    test("when invalid key", () => {
      const entries: unknown = [[123, 1], ["key_2", 2]];

      const issues = [];
      const current = MapPlainParseHelper.parsePrimitiveMap(entries, StringPlainParseHelper.parseString, NumberPlainParseHelper.parseNumber, "map", issues);

      expect(issues).toEqual([current]);
      expect(current).toEqual(new InvalidMapEntriesPlainParseIssue([
        new InvalidMapEntryPlainParseIssue(new InvalidTypePlainParseIssue("string", "number"), undefined, "0")
      ], "map"));
    });

    test("when invalid value", () => {
      const entries: unknown = [["key_1", "invalid"], ["key_2", 2]];

      const issues = [];
      const current = MapPlainParseHelper.parsePrimitiveMap(entries, StringPlainParseHelper.parseString, NumberPlainParseHelper.parseNumber, "map", issues);

      expect(issues).toEqual([current]);
      expect(current).toEqual(new InvalidMapEntriesPlainParseIssue([
        new InvalidMapEntryPlainParseIssue(undefined, new InvalidTypePlainParseIssue("number", "string"), "0")
      ], "map"));
    });
  });


  describe("parseHObjectMap", () => {
    test("when valid", () => {
      const entries: unknown = [["key_1", { primitiveField: 10 }], ["key_2", { primitiveField: 20 }]];

      const current = MapPlainParseHelper.parseHObjectMap(entries, StringPlainParseHelper.parseString, OtherTestDTO);

      const expected = new Map([
        ["key_1", OtherTestDTO.cs({ primitiveField: 10 })],
        ["key_2", OtherTestDTO.cs({ primitiveField: 20 })]
      ]);
      expect(current).toEqual(expected);

    });

    test("when invalid type", () => {
      const entries: unknown = 100;

      const issues = [];
      const current = MapPlainParseHelper.parseHObjectMap(entries, StringPlainParseHelper.parseString, OtherTestDTO, "map", issues);

      expect(issues).toEqual([current]);
      expect(current).toEqual(new InvalidTypePlainParseIssue("map_entries", "number", "map"));
    });

    test("when missing entry value", () => {
      const entries: unknown = [["key_1"], ["key_2", { primitiveField: 20 }]];

      const issues = [];
      const current = MapPlainParseHelper.parseHObjectMap(entries, StringPlainParseHelper.parseString, OtherTestDTO, "map", issues);

      expect(issues).toEqual([current]);
      expect(current).toEqual(new InvalidMapEntriesPlainParseIssue([
        new InvalidTypePlainParseIssue("map_entry", "array", "0")
      ], "map"));
    });

    test("when missing entry key", () => {
      const entries: unknown = [[{ primitiveField: 10 }], ["key_2", { primitiveField: 20 }]];

      const issues = [];
      const current = MapPlainParseHelper.parseHObjectMap(entries, StringPlainParseHelper.parseString, OtherTestDTO, "map", issues);

      expect(issues).toEqual([current]);
      expect(current).toEqual(new InvalidMapEntriesPlainParseIssue([
        new InvalidTypePlainParseIssue("map_entry", "array", "0")
      ], "map"));
    });

    test("when invalid key", () => {
      const entries: unknown = [[123, { primitiveField: 10 }], ["key_2", { primitiveField: 20 }]];

      const issues = [];
      const current = MapPlainParseHelper.parseHObjectMap(entries, StringPlainParseHelper.parseString, OtherTestDTO, "map", issues);

      expect(issues).toEqual([current]);
      expect(current).toEqual(new InvalidMapEntriesPlainParseIssue([
        new InvalidMapEntryPlainParseIssue(new InvalidTypePlainParseIssue("string", "number"), undefined, "0")
      ], "map"));
    });

    test("when invalid value", () => {
      const entries: unknown = [["key_1", { primitiveField: "invalid" }], ["key_2", { primitiveField: 20 }]];

      const issues = [];
      const current = MapPlainParseHelper.parseHObjectMap(entries, StringPlainParseHelper.parseString, OtherTestDTO, "map", issues);

      expect(issues).toEqual([current]);
      expect(current).toEqual(new InvalidMapEntriesPlainParseIssue([
        new InvalidMapEntryPlainParseIssue(undefined, new InvalidHObjectPlainParseIssue(OtherTestDTO.HOBJ_META, [
          new InvalidTypePlainParseIssue("number", "string", "primitiveField")
        ]), "0")
      ], "map"));
    });
  });
});
