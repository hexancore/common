import { AppErrorCode } from "../Error/AppError";
import { HObjectTypeMeta, type HObjectType, type PlainParsableHObjectType } from "../Feature";
import { ERR, type R } from "../Result";
import { InvalidArrayElementsPlainParseIssue, InvalidHObjectPlainParseIssue as InvalidHObjectPlainParseIssue, InvalidTypePlainParseIssue, PlainParseIssue } from "./PlainParseIssue";

export const PlainParseError = 'core.plain.parse' as const;
export type PlainParseError = typeof PlainParseError;

/**
  -9223372036854775808
   9223372036854775807
 */
const BigInt64Regex = /^-?\d{1,19}$/;

export class PlainParseHelper {

  public static HObjectParseErr<T extends object>(hcObjectClass: HObjectType<T>, issues: PlainParseIssue[]): R<T, PlainParseError> {
    const meta = HObjectTypeMeta.extractFromClass(hcObjectClass);
    return ERR(PlainParseError, AppErrorCode.BAD_REQUEST, new InvalidHObjectPlainParseIssue(meta, issues));
  }

  public static parseBigInt64(plain: unknown, path?: string, issues?: PlainParseIssue[]): bigint | PlainParseIssue {
    if (typeof plain === 'number' || (typeof plain === 'string' && BigInt64Regex.test(plain))) {
      return BigInt(plain);
    }

    const issue = new InvalidTypePlainParseIssue('bigint_string', typeof plain, path);
    if (issues) {
      issues.push(issue);
    }

    return issue;
  }

  public static parseNumber(plain: unknown, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (typeof plain === 'number') {
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('number', typeof plain, path);
    if (issues) {
      issues.push(issue);
    }

    return issue;
  }

  public static parseString(plain: unknown, path?: string, issues?: PlainParseIssue[]): string | PlainParseIssue {
    if (typeof plain === 'string') {
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('string', typeof plain, path);
    if (issues) {
      issues.push(issue);
    }

    return issue;
  }

  public static parseBoolean(plain: unknown, path?: string, issues?: PlainParseIssue[]): boolean | PlainParseIssue {
    if (typeof plain === 'boolean') {
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('boolean', typeof plain, path);
    if (issues) {
      issues.push(issue);
    }

    return issue;
  }

  public static parseHObject<T extends object>(plain: unknown, objectClass: PlainParsableHObjectType<T, any>, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T {
    const parsed = objectClass.parse(plain);
    if (parsed.isError()) {
      const issue = parsed.e.data as InvalidHObjectPlainParseIssue;
      issue.path = path;

      if (issues) {
        issues.push(issue);
      }
      return issue;
    }

    return parsed.v;
  }

  public static parsePrimitiveArray<T>(plain: unknown, parse: (v: unknown) => T | PlainParseIssue, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T[] {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue('array', typeof plain, path);
      if (issues) {
        issues.push(issue);
      }

      return issue;
    }

    let localIssues: PlainParseIssue[] | null = null;
    const parsedValues: T[] = [];
    for (let i = 0; i < plain.length; i++) {
      const parsed = parse(plain[i]);

      if (parsed instanceof PlainParseIssue) {
        parsed.path = '' + i;
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
      if (issues) {
        issues.push(issue);
      }

      return issue;
    }
    return parsedValues;
  }

  public static parseHObjectArray<T extends object>(plain: unknown, objectClass: PlainParsableHObjectType<T, any>, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T[] {
    if (!Array.isArray(plain)) {
      const issue = new InvalidTypePlainParseIssue('array', typeof plain, path);
      if (issues) {
        issues.push(issue);
      }

      return issue;
    }

    let localIssues: PlainParseIssue[] | null = null;
    const parsedValues: T[] = [];
    for (let i = 0; i < plain.length; i++) {
      const parsed = objectClass.parse(plain[i]);

      if (parsed.isError()) {
        const issue = parsed.e.data as InvalidHObjectPlainParseIssue;
        issue.path = '' + i;
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
      if (issues) {
        issues.push(issue);
      }

      return issue;
    }
    return parsedValues;
  }
}
