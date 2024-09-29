import { InvalidStringPlainParseIssue, InvalidTypePlainParseIssue, OutOfRangePlainParseIssue, PlainParseIssue, TooBigPlainParseIssue, TooSmallPlainParseIssue } from "./PlainParseIssue";

export class StringPlainParseHelper {

  public static parseString(plain: unknown, path?: string, issues?: PlainParseIssue[]): string | PlainParseIssue {
    if (typeof plain === 'string') {
      return plain;
    }

    const issue = new InvalidTypePlainParseIssue('string', typeof plain, path);
    issues?.push(issue);
    return issue;
  }

  public static parseStringRegex(plain: unknown, regex: RegExp, path?: string, issues?: PlainParseIssue[]): string | PlainParseIssue {
    if (typeof plain !== 'string') {
      const issue = new InvalidTypePlainParseIssue('string', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (!regex.test(plain)) {
      const issue = InvalidStringPlainParseIssue.regex(regex, path);
      issues?.push(issue);
      return issue;
    }
    return plain;
  }

  public static parseStringLength(plain: unknown, length: number, path?: string, issues?: PlainParseIssue[]): string | PlainParseIssue {
    if (typeof plain !== 'string') {
      const issue = new InvalidTypePlainParseIssue('string', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (plain.length !== length) {
      const issue = plain.length > length
        ? TooBigPlainParseIssue.stringLengthExactly(length, plain.length, path)
        : TooSmallPlainParseIssue.stringLengthExactly(length, plain.length, path);
      issues?.push(issue);
      return issue;
    }

    return plain;
  }

  public static parseStringLengthMin(plain: unknown, min: number, path?: string, issues?: PlainParseIssue[]): string | PlainParseIssue {
    if (typeof plain !== 'string') {
      const issue = new InvalidTypePlainParseIssue('string', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (plain.length < min) {
      const issue = TooSmallPlainParseIssue.stringLengthAtLeast(min, plain.length, path);
      issues?.push(issue);
      return issue;
    }
    return plain;
  }

  public static parseStringLengthMax(plain: unknown, max: number, path?: string, issues?: PlainParseIssue[]): string | PlainParseIssue {
    if (typeof plain !== 'string') {
      const issue = new InvalidTypePlainParseIssue('string', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (plain.length > max) {
      const issue = TooBigPlainParseIssue.stringLengthMax(max, plain.length, path);
      issues?.push(issue);
      return issue;
    }
    return plain;
  }

  public static parseStringLengthBetween(plain: unknown, min: number, max: number, path?: string, issues?: PlainParseIssue[]): string | PlainParseIssue {
    if (typeof plain !== 'string') {
      const issue = new InvalidTypePlainParseIssue('string', typeof plain, path);
      issues?.push(issue);
      return issue;
    }

    if (plain.length < min || plain.length > max) {
      const issue = OutOfRangePlainParseIssue.stringLengthBetween(min, max, plain.length, path);
      issues?.push(issue);
      return issue;
    }

    return plain;
  }
}
