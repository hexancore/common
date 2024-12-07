import { type PlainParsableHObjectType } from "../Feature/HObjectTypeMeta";
import { ArrayPlainParseHelper } from "./ArrayPlainParseHelper";
import { InvalidArrayElementsPlainParseIssue, InvalidHObjectPlainParseIssue, InvalidMapEntriesPlainParseIssue, InvalidMapEntryPlainParseIssue, InvalidTypePlainParseIssue, OutOfRangePlainParseIssue, PlainParseIssue, TooBigPlainParseIssue, TooSmallPlainParseIssue } from "./PlainParseIssue";

export type ParseMapEntryKeyFn<T> = (v: unknown) => T | PlainParseIssue;
export type ParseMapEntryValueFn<T> = (v: unknown) => T | PlainParseIssue;

export class MapPlainParseHelper {

  public static parsePrimitiveMap<K extends number | string, V>(
    plain: unknown,
    parseEntryKey: ParseMapEntryKeyFn<K>,
    parseEntryValue: ParseMapEntryValueFn<V>,
    path?: string,
    issues?: PlainParseIssue[]
  ): PlainParseIssue | Map<K, V> {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue("map_entries", typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    const entries = ArrayPlainParseHelper.parsePrimitiveArray(plain, (plainEntry) => {
      if (!Array.isArray(plainEntry)) {
        return new InvalidTypePlainParseIssue("map_entry", typeof plainEntry);
      }

      if (plainEntry.length !== 2) {
        return new InvalidTypePlainParseIssue("map_entry", "array");
      }

      const key = parseEntryKey(plainEntry[0]);
      const value = parseEntryValue(plainEntry[1]);

      let keyIssue, valueIssue;
      if (key instanceof PlainParseIssue) {
        keyIssue = key;
      }

      if (value instanceof PlainParseIssue) {
        valueIssue = value;
      }

      if (keyIssue || valueIssue) {
        return new InvalidMapEntryPlainParseIssue(keyIssue, valueIssue);
      }

      return [key, value];
    });

    if (entries instanceof InvalidArrayElementsPlainParseIssue) {
      const issue = new InvalidMapEntriesPlainParseIssue(entries.issues as any, path);
      issues?.push(issue);
      return issue;
    }

    return new Map(entries as any);
  }

  public static parseHObjectMap<K extends number | string, V extends object>(
    plain: unknown,
    parseEntryKey: ParseMapEntryKeyFn<K>,
    objectClass: PlainParsableHObjectType<V, any>,
    path?: string,
    issues?: PlainParseIssue[]
  ): PlainParseIssue | Map<K, V> {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue("map_entries", typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    const entries = ArrayPlainParseHelper.parsePrimitiveArray(plain, (plainEntry) => {
      if (!Array.isArray(plainEntry)) {
        return new InvalidTypePlainParseIssue("map_entry", typeof plainEntry);
      }

      if (plainEntry.length !== 2) {
        return new InvalidTypePlainParseIssue("map_entry", "array");
      }

      const key = parseEntryKey(plainEntry[0]);
      const valueParseResult = objectClass.parse(plainEntry[1]);

      let keyIssue, valueIssue;
      if (key instanceof PlainParseIssue) {
        keyIssue = key;
      }

      if (valueParseResult.isError()) {
        valueIssue = valueParseResult.e.data as InvalidHObjectPlainParseIssue;
      }

      if (keyIssue || valueIssue) {
        return new InvalidMapEntryPlainParseIssue(keyIssue, valueIssue);
      }

      return [key, valueParseResult.v];
    });

    if (entries instanceof InvalidArrayElementsPlainParseIssue) {
      const issue = new InvalidMapEntriesPlainParseIssue(entries.issues as any, path);
      issues?.push(issue);
      return issue;
    }

    return new Map(entries as any);
  }
}