/**
 * @group unit
 */

import { ErrorHelper } from "@/Util/Error/ErrorHelper";
import { LogicError } from "@/Util/Error/LogicError";


describe('ErrorHelper', () => {

    test('toPlain', () => {
      const error = new LogicError("test");

      const current = ErrorHelper.toPlain(error);

      const expected = {
        type: "LogicError",
        message: "test",
        stacktrace: ErrorHelper.convertStackTraceToArray(error.stack),
      };
      expect(current).toEqual(expected);
    });

    test('convertStackTraceToArray', () => {
      const stackTrace = " line_0\n line_1\n line_2";

      const current = ErrorHelper.convertStackTraceToArray(stackTrace);

      const expected = [
        "line_1",
        "line_2"
      ];
      expect(current).toEqual(expected);
    });

  });