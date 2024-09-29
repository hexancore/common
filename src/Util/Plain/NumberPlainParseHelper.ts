import { InvalidTypePlainParseIssue, PlainParseIssue, TooBigPlainParseIssue, TooSmallPlainParseIssue } from "./PlainParseIssue";

export class NumberPlainParseHelper {
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
      if (plain > max) {
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
}
