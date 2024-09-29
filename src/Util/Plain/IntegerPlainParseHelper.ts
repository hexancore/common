import { InvalidTypePlainParseIssue, OutOfRangePlainParseIssue, PlainParseIssue, TooBigPlainParseIssue, TooSmallPlainParseIssue } from "./PlainParseIssue";

export class IntegerPlainParseHelper {

  public static parseInt(plain: unknown, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('int', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    return plain as number;
  }

  public static parseIntGTE(plain: unknown, min: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('int', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) < min) {
      const issue = TooSmallPlainParseIssue.numberGTE(min, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);
  }

  public static parseIntGT(plain: unknown, min: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('int', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) <= min) {
      const issue = TooSmallPlainParseIssue.numberGT(min, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);
  }

  public static parseIntLT(plain: unknown, max: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('int', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) >= max) {
      const issue = TooBigPlainParseIssue.numberLT(max, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);
  }

  public static parseIntLTE(plain: unknown, max: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('int', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) > max) {
      const issue = TooBigPlainParseIssue.numberLTE(max, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);
  }

  public static parseIntBetween(plain: unknown, min: number, max: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('int', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) < min || (plain as number) > max) {
      const issue = OutOfRangePlainParseIssue.numberBetween(min, max, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);
  }

  public static parseIntBetweenExclusively(plain: unknown, min: number, max: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('int', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) < min || (plain as number) > max) {
      const issue = OutOfRangePlainParseIssue.numberBetweenExclusively(min, max, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);
  }

  public static parseUInt(plain: unknown, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('uint', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) < 0) {
      const issue = TooSmallPlainParseIssue.numberGTE(0, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);

  }

  public static parseUIntGTE(plain: unknown, min: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('uint', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) < min) {
      const issue = TooSmallPlainParseIssue.numberGTE(min, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);
  }

  public static parseUIntGT(plain: unknown, min: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('uint', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) <= min) {
      const issue = TooSmallPlainParseIssue.numberGT(min, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);
  }

  public static parseUIntLT(plain: unknown, max: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('uint', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) >= max) {
      const issue = TooBigPlainParseIssue.numberLT(max, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);
  }

  public static parseUIntLTE(plain: unknown, max: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('uint', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) > max) {
      const issue = TooBigPlainParseIssue.numberLTE(max, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);
  }

  public static parseUIntBetween(plain: unknown, min: number, max: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('uint', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) < min || (plain as number) > max) {
      const issue = OutOfRangePlainParseIssue.numberBetween(min, max, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);
  }

  public static parseUIntBetweenExclusively(plain: unknown, min: number, max: number, path?: string, issues?: PlainParseIssue[]): number | PlainParseIssue {
    if (!Number.isInteger(plain)) {
      const issue = new InvalidTypePlainParseIssue('uint', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if ((plain as number) < min || (plain as number) > max) {
      const issue = OutOfRangePlainParseIssue.numberBetweenExclusively(min, max, (plain as number), path);
      issues?.push(issue);
      return issue;
    }
    return (plain as number);
  }
}
