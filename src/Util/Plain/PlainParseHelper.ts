import { AppErrorCode } from "../Error/AppError";
import { HObjectTypeMeta, type HObjectType, type PlainParsableHObjectType } from "../Feature/HObjectTypeMeta";
import { ERR, type R } from "../Result";
import { InvalidHObjectPlainParseIssue, InvalidTypePlainParseIssue, PlainParseIssue, TooSmallPlainParseIssue } from "./PlainParseIssue";

export const PlainParseError = 'core.plain.parse' as const;
export type PlainParseError = typeof PlainParseError;

/**
  -9223372036854775808
   9223372036854775807
 */
const BigInt64Regex = /^-?\d{1,19}$/;

/**
 * 0
 * 18446744073709551615
 */
const UInt64Regex = /^(0|[1-9]\d{0,19})$/;

export class PlainParseHelper {

  public static HObjectParseErr<T>(hObjectClass: HObjectType<any>, issues: PlainParseIssue[]): R<T, PlainParseError> {
    const meta = HObjectTypeMeta.extractFromClass(hObjectClass);
    return ERR(PlainParseError, AppErrorCode.BAD_REQUEST, new InvalidHObjectPlainParseIssue(meta, issues));
  }

  public static HObjectIsNotObjectParseErr<T>(hcObjectClass: HObjectType<any>, plain: unknown): R<T, PlainParseError> {
    return PlainParseHelper.HObjectParseErr(hcObjectClass, [new InvalidTypePlainParseIssue('object', typeof plain)]);
  }

  public static parseBigInt64(plain: unknown, path?: string, issues?: PlainParseIssue[]): bigint | PlainParseIssue {
    if (typeof plain === 'number' || typeof plain === 'bigint' || (typeof plain === 'string' && BigInt64Regex.test(plain))) {
      return BigInt(plain);
    }

    const issue = new InvalidTypePlainParseIssue('bigint_string', typeof plain, path);
    if (issues) {
      issues.push(issue);
    }

    return issue;
  }

  public static parseBigInt64GTE(plain: unknown, min: bigint, path?: string, issues?: PlainParseIssue[]): bigint | PlainParseIssue {
    if (typeof plain === 'number' || typeof plain === 'bigint' || (typeof plain === 'string' && BigInt64Regex.test(plain))) {
      const parsed = BigInt(plain);
      if (parsed < min) {
        const issue = TooSmallPlainParseIssue.bigintGTE(min, parsed, path);
        issues?.push(issue);
        return issue;
      }
      return parsed;
    }
    const issue = new InvalidTypePlainParseIssue('bigint_string', typeof plain, path);
    issues?.push(issue);
    return issue;
  }

  public static parseUInt64(plain: unknown, path?: string, issues?: PlainParseIssue[]): bigint | PlainParseIssue {
    if (typeof plain === 'number' || typeof plain === 'bigint' || (typeof plain === 'string' && UInt64Regex.test(plain))) {
      return BigInt(plain);
    }
    const issue = new InvalidTypePlainParseIssue('uint64_string', typeof plain, path);
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
      issues?.push(issue);
      return issue;
    }

    return parsed.v;
  }

  public static parseRecord<T extends Record<string, unknown>>(plain: unknown, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T {
    if (typeof plain === 'object' && plain !== null) {
      return plain as T;
    }

    const issue = new InvalidTypePlainParseIssue('object', plain === null ? 'null' : typeof plain, path);
    if (issues) {
      issues.push(issue);
    }

    return issue;
  }

  public static parseMap<T extends Record<string, unknown>>(plain: unknown, path?: string, issues?: PlainParseIssue[]): PlainParseIssue | T {
    if (typeof plain === 'object' && plain !== null) {
      return plain as T;
    }

    const issue = new InvalidTypePlainParseIssue('object', plain === null ? 'null' : typeof plain, path);
    if (issues) {
      issues.push(issue);
    }

    return issue;
  }
}
