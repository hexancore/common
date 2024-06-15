import { OK, R } from './Result';

const PARAMS_REGEX = /:([a-zA-Z0-9_]+)/g;

/**
 * Replaces :<param> with given value
 * https://example.com/:id/posts/:postId
 */
export class StringTemplate<T = Record<string, any>> {
  public constructor(public readonly template: string) {}

  public static hasAnyParam(template: string): boolean {
    PARAMS_REGEX.lastIndex = 0;
    return PARAMS_REGEX.test(template);
  }

  public static extractParams(template: string): string[] {
    PARAMS_REGEX.lastIndex = 0;
    return Array.from(template.matchAll(PARAMS_REGEX)).map((m) => m[1]) as unknown as string[];
  }

  public render(params: T): R<string> {
    PARAMS_REGEX.lastIndex = 0;
    const result = this.template.replace(PARAMS_REGEX, (_, name) => {
      return params[name];
    });

    return OK(result);
  }
}
