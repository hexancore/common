import { JsonErrors, JsonHelper } from '@/Util/Json/JsonHelper';

describe('JsonHelper', () => {
  describe('parse', () => {
    test('when valid input', () => {
      const value = JSON.stringify({ field: 'value' });

      const current = JsonHelper.parse(value);

      expect(current).toMatchSuccessResult({ field: 'value' });
    });

    test('when invalid input', () => {
      const value = JSON.stringify({ field: 'value' }).replace('{', '#');

      const current = JsonHelper.parse(value);

      expect(current).toMatchAppError({
        type: JsonErrors.parse,
        code: 400,
      });
    });
  });

  describe('stringify', () => {
    test('when valid input', () => {
      const value = { field: 'value' };

      const current = JsonHelper.stringify(value);

      expect(current).toMatchSuccessResult(JSON.stringify({ field: 'value' }));
    });

    test('when invalid input', () => {
      const value = { field: 'value', field2: null };
      value.field2 = value;

      const current = JsonHelper.stringify(value);

      expect(current).toMatchAppError({
        type: JsonErrors.stringify,
        code: 400,
      });
    });
  });
});
