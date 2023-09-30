/**
 * @group unit
 */

import { TEST_SUIT_NAME } from '@/Test/functions';
import { StringTemplate } from '@/Util/StringTemplate';

interface TestStringTemplateParams {
  param1: string;
  param2: string;
}
describe(TEST_SUIT_NAME(__filename), () => {
  let template: StringTemplate<TestStringTemplateParams>;

  beforeAll(() => {
    template = new StringTemplate('https://test/:param1/:param2/test');
  });

  test('inject', () => {
    const current = template.render({
      param1: 'test_param1',
      param2: 'test_param2',
    });

    expect(current.v).toBe('https://test/test_param1/test_param2/test');
  });

  test('extractParams', () => {
    const current = StringTemplate.extractParams('https://test/:param1/:param2/test/:param3');

    expect(current).toEqual(["param1", "param2", "param3"]);
  });
});
