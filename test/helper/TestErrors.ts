import { DefineErrorsUnion } from '@';

export const TestErrors = {
  error_start: 'error_start',
  error_1: 'error_1',
  error_2: 'error_2',
} as const;
export type TestErrors<K extends keyof typeof TestErrors> = DefineErrorsUnion<typeof TestErrors, K>;

export class TestStartOk {
  public field = 'test_start_ok';
}
export class TestOk1 {
  public field = 'test_ok_1';
}

export class TestErrSuccess1 {
  public field = 'test_err_success1';
}
