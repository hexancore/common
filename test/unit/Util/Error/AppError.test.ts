/**
 * @group unit
 */

import { AppError } from "@";

describe('AppError', () => {

    test('panic()', () => {
       const e = new AppError({type: "core.test.something", data: {"a": 10}});

       expect(() => e.panic()).toThrowError('core.test.something: {"a":10}');
    });

  });