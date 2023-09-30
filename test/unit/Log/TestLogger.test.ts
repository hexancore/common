/**
 * @group unit
 */

import { AppError, AppErrorCode } from '@';
import { getLogger, LogRecord } from '@/Log';
import { TestLogger } from '@/Log/TestLogger';
import { LogicError } from '@/Util/Error/LogicError';
import { ErrorHelper } from '@/Util/Error/ErrorHelper';

describe('TestLogger', () => {
  let logger: TestLogger;

  beforeEach(() => {
    logger = getLogger('test', ['test_tag']) as TestLogger;
  });

  describe('log', () => {
    test('when first paramter is LogLevel ', () => {
      logger.log('info', 'test message', { test_context: 1 }, ['test_log_tag']);

      const expected: LogRecord = {
        level: 'info',
        message: 'test message',
        context: { test_context: 1 },
        tags: ['test_tag', 'test_log_tag'],
      };
      expect(logger.records).toEqual([expected]);
    });

    test('when first parameter is AppError without error prop', () => {
      logger.log(new AppError({ type: 'test_type', code: AppErrorCode.BAD_REQUEST }), ['test_log_tag']);

      const expected: LogRecord = {
        level: 'warn',
        message: 'test_type',
        context: { code: 400, type: 'test_type', data: null },
        tags: ['test_tag', 'test_log_tag'],
      };
      expect(logger.records).toEqual([expected]);
    });

    test('when first parameter is AppError with error prop', () => {
      const error = new LogicError('test_error_message');
      logger.log(new AppError({ type: 'test_type', error }), ['test_log_tag']);

      const expected: LogRecord = {
        level: 'error',
        message: 'test_error_message',
        context: { type: 'test_type', code: AppErrorCode.INTERNAL_ERROR, data: null, error: ErrorHelper.toPlain(error) },
        tags: ['test_tag', 'test_log_tag'],
      };
      expect(logger.records).toEqual([expected]);
    });
  });
});
