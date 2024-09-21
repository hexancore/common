import { AppErrorCode } from "../Error/AppError";
import { HObjectTypeMeta, type HObjectType, type PlainParsableHObjectType } from "../Feature";
import { ERR, type R } from "../Result";
import { InvalidArrayElementsPlainParseIssue, InvalidHObjectPlainParseIssue as InvalidHObjectPlainParseIssue, InvalidTypePlainParseIssue, PlainParseIssue, TooBigPlainParseIssue, TooSmallPlainParseIssue } from "./PlainParseIssue";

export const PlainParseError = 'core.plain.parse' as const;
export type PlainParseError = typeof PlainParseError;

/**
  -9223372036854775808
   9223372036854775807
 */
const BigInt64Regex = /^-?\d{1,19}$/;

export class PlainParseHelper {

  public static HObjectParseErr<T extends object>(hObjectClass: HObjectType<T>, issues: PlainParseIssue[]): R<T, PlainParseError> {
    const meta = HObjectTypeMeta.extractFromClass(hObjectClass);
    return ERR(PlainParseError, AppErrorCode.BAD_REQUEST, new InvalidHObjectPlainParseIssue(meta, issues));
  }

  public static HObjectIsNotObjectParseErr<T extends object>(hcObjectClass: HObjectType<T>, plain: unknown): R<T, PlainParseError> {
    return PlainParseHelper.HObjectParseErr(hcObjectClass, [new InvalidTypePlainParseIssue('object', typeof plain)]);
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

  public static parseNumberGTE(plain: unknown, min: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (typeof plain === 'number') {
      if (plain < min) {
        const issue = TooSmallPlainParseIssue.numberGTE(min, plain, path);
        issues?.push(issue);
        return issue;
      }
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('number', typeof plain, path);
    issues?.push(issue);
    return issue;
  }

  public static parseNumberGT(plain: unknown, min: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (typeof plain === 'number') {
      if (plain <= min) {
        const issue = TooSmallPlainParseIssue.numberGT(min, plain, path);
        issues?.push(issue);
        return issue;
      }
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('number', typeof plain, path);
    issues?.push(issue);
    return issue;
  }

  public static parseNumberLT(plain: unknown, max: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (typeof plain === 'number') {
      if (plain >= max) {
        const issue = TooBigPlainParseIssue.numberLT(max, plain, path);
        issues?.push(issue);
        return issue;
      }
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('number', typeof plain, path);
    issues?.push(issue);
    return issue;
  }

  public static parseNumberLTE(plain: unknown, max: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (typeof plain === 'number') {
      if (plain >= max) {
        const issue = TooBigPlainParseIssue.numberLTE(max, plain, path);
        issues?.push(issue);
        return issue;
      }
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('number', typeof plain, path);
    issues?.push(issue);
    return issue;
  }

  public static parseNumberExactly(plain: unknown, exactly: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (typeof plain === 'number') {
      if (plain !== exactly) {
        const issue = plain > exactly
          ? TooBigPlainParseIssue.numberExactly(exactly, plain, path)
          : TooSmallPlainParseIssue.numberExactly(exactly, plain, path);
        issues?.push(issue);
        return issue;
      }
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('number', typeof plain, path);
    issues?.push(issue);
    return issue;
  }

  public static parseString(plain: unknown, path?: string, issues?: PlainParseIssue[]): string | PlainParseIssue {
    if (typeof plain === 'string') {
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('string', typeof plain, path);
    issues?.push(issue);
    return issue;
  }

  public static parseStringLength(plain: unknown, length: number, path?: string, issues?: PlainParseIssue[]): string | PlainParseIssue {
    if (typeof plain === 'string') {
      if (plain.length !== length) {
        const issue = plain.length > length
          ? TooBigPlainParseIssue.stringLengthExactly(length, plain.length, path)
          : TooSmallPlainParseIssue.stringLengthExactly(length, plain.length, path);
        issues?.push(issue);
        return issue;
      }
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('string', typeof plain, path);
    issues?.push(issue);
    return issue;
  }

  public static parseStringLengthMin(plain: unknown, min: number, path?: string, issues?: PlainParseIssue[]): string | PlainParseIssue {
    if (typeof plain === 'string') {
      if (plain.length < min) {
        const issue = TooSmallPlainParseIssue.stringLengthAtLeast(min, plain.length, path);
        issues?.push(issue);
        return issue;
      }
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('string', typeof plain, path);
    issues?.push(issue);
    return issue;
  }

  public static parseStringLengthMax(plain: unknown, max: number, path?: string, issues?: PlainParseIssue[]): string | PlainParseIssue {
    if (typeof plain === 'string') {
      if (plain.length > max) {
        const issue = TooBigPlainParseIssue.stringLengthMax(max, plain.length, path);
        issues?.push(issue);
        return issue;
      }
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('string', typeof plain, path);
    issues?.push(issue);
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
