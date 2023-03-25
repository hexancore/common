/**
 * @group unit
 */

import { AppMeta } from '@/Util/AppMeta';

describe('AppMeta', () => {
  describe('get', () => {
    test('when factory sets', () => {
      const current = AppMeta.get();

      expect(current).toBeInstanceOf(AppMeta);
      expect(current.getProps()).toEqual(AppMeta.propsProvider());
    });

    test('when second time', () => {
      const current = AppMeta.get();
      const expected = AppMeta.get();

      expect(current).toBe(expected);
    });
  });
});
