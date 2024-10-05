import { type PlainParsableHObjectType } from "../Feature";
import { InvalidArrayElementsPlainParseIssue, InvalidHObjectPlainParseIssue, InvalidTypePlainParseIssue, OutOfRangePlainParseIssue, PlainParseIssue, TooBigPlainParseIssue, TooSmallPlainParseIssue } from "./PlainParseIssue";

export type ParseArrayItemFn<T> = (v: unknown) => T | PlainParseIssue;
export class ArrayPlainParseHelper {

  public static parsePrimitiveArrayItemsMin<T>(plain: unknown, minItems: number, parse: ParseArrayItemFn<T>, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T[] {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue("array", typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (plain.length < minItems) {
      const issue = TooSmallPlainParseIssue.arrayAtLeastSize(minItems, plain.length, path);
      issues?.push(issue);
      return issue;
    }

    return ArrayPlainParseHelper.parsePrimitiveArray(plain, parse, path, issues);
  }

  public static parsePrimitiveArrayItemsMax<T>(plain: unknown, maxItems: number, parse: ParseArrayItemFn<T>, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T[] {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue("array", typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (plain.length > maxItems) {
      const issue = TooBigPlainParseIssue.arrayMaxSize(maxItems, plain.length, path);
      issues?.push(issue);
      return issue;
    }

    return ArrayPlainParseHelper.parsePrimitiveArray(plain, parse, path, issues);
  }

  public static parsePrimitiveArrayItemsBetween<T>(plain: unknown, minItems: number, maxItems: number, parse: ParseArrayItemFn<T>, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T[] {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue("array", typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (plain.length > maxItems || plain.length < minItems) {
      const issue = OutOfRangePlainParseIssue.arrayBetween(minItems, maxItems, plain.length, path);
      issues?.push(issue);
      return issue;
    }

    return ArrayPlainParseHelper.parsePrimitiveArray(plain, parse, path, issues);
  }

  public static parsePrimitiveArrayItemsExactly<T extends object>(plain: unknown, exactlyItems: number, parse: ParseArrayItemFn<T>, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T[] {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue("array", typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (plain.length !== exactlyItems) {
      const issue = plain.length > exactlyItems
        ? TooBigPlainParseIssue.arrayExactlySize(exactlyItems, plain.length, path)
        : TooSmallPlainParseIssue.arrayExactlySize(exactlyItems, plain.length, path);
      issues?.push(issue);
      return issue;
    }

    return ArrayPlainParseHelper.parsePrimitiveArray(plain, parse, path, issues);
  }

  public static parsePrimitiveArray<T>(plain: unknown, parse: ParseArrayItemFn<T>, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T[] {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue("array", typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    let localIssues: PlainParseIssue[] | null = null;
    const parsedValues: T[] = [];
    for (let i = 0; i < plain.length; i++) {
      const parsed = parse(plain[i]);

      if (parsed instanceof PlainParseIssue) {
        parsed.path = "" + i;
        if (!localIssues) {
          localIssues = [parsed];
        } else {
          localIssues.push(parsed);
        }
        continue;
      }

      if (!localIssues) {
        parsedValues.push(parsed);
      }
    }

    if (localIssues) {
      const issue = new InvalidArrayElementsPlainParseIssue(localIssues, path);
      issues?.push(issue);
      return issue;
    }
    return parsedValues;
  }

  public static parseHObjectArrayItemsMin<T extends object>(plain: unknown, minItems: number, objectClass: PlainParsableHObjectType<T, any>, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T[] {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue("array", typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (plain.length < minItems) {
      const issue = TooSmallPlainParseIssue.arrayAtLeastSize(minItems, plain.length, path);
      issues?.push(issue);
      return issue;
    }

    return ArrayPlainParseHelper.parseHObjectArray(plain, objectClass, path, issues);
  }

  public static parseHObjectArrayItemsMax<T extends object>(plain: unknown, maxItems: number, objectClass: PlainParsableHObjectType<T, any>, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T[] {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue("array", typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (plain.length > maxItems) {
      const issue = TooBigPlainParseIssue.arrayMaxSize(maxItems, plain.length, path);
      issues?.push(issue);
      return issue;
    }

    return ArrayPlainParseHelper.parseHObjectArray(plain, objectClass, path, issues);
  }

  public static parseHObjectArrayItemsBetween<T extends object>(plain: unknown, minItems: number, maxItems: number, objectClass: PlainParsableHObjectType<T, any>, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T[] {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue("array", typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (plain.length > maxItems || plain.length < minItems) {
      const issue = OutOfRangePlainParseIssue.arrayBetween(minItems, maxItems, plain.length, path);
      issues?.push(issue);
      return issue;
    }

    return ArrayPlainParseHelper.parseHObjectArray(plain, objectClass, path, issues);
  }


  public static parseHObjectArrayItemsExactly<T extends object>(plain: unknown, exactlyItems: number, objectClass: PlainParsableHObjectType<T, any>, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T[] {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue("array", typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (plain.length !== exactlyItems) {
      const issue = plain.length > exactlyItems
        ? TooBigPlainParseIssue.arrayExactlySize(exactlyItems, plain.length, path)
        : TooSmallPlainParseIssue.arrayExactlySize(exactlyItems, plain.length, path);
      issues?.push(issue);
      return issue;
    }

    return ArrayPlainParseHelper.parseHObjectArray(plain, objectClass, path, issues);
  }

  public static parseHObjectArray<T extends object>(plain: unknown, objectClass: PlainParsableHObjectType<T, any>, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T[] {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue('array', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    let localIssues: PlainParseIssue[] | null = null;
    const parsedValues: T[] = [];
    for (let i = 0; i < plain.length; i++) {
      const parsed = objectClass.parse(plain[i]);

      if (parsed.isError()) {
        const issue = parsed.e.data as InvalidHObjectPlainParseIssue;
        issue.path = "" + i;
        if (!localIssues) {
          localIssues = [issue];
        } else {
          localIssues.push(issue);
        }
        continue;
      }

      if (!localIssues) {
        parsedValues.push(parsed.v);
      }
    }

    if (localIssues) {
      const issue = new InvalidArrayElementsPlainParseIssue(localIssues, path);
      issues?.push(issue);
      return issue;
    }
    return parsedValues;
  }
}