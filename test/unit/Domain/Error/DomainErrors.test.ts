/**
 * @group unit/common
 */

import { ERR } from '@';
import { DefineDomainErrors, standard_entity_errors } from '@/Domain/Error/DomainErrors';

describe('DomainErrors', () => {
  const errors = DefineDomainErrors(
    new (class Test {
      entity_test_1: standard_entity_errors = 'not_found';
      entity_test_2: standard_entity_errors | 'custom_1' = 'not_found';
      other_error = '';
    })(),
  );
  test('t()', () => {
    expect(errors.entity.test_1.t('not_found')).toBe('test.domain.entity.test_1.not_found');
    expect(errors.entity.test_1.t('duplicate')).toBe('test.domain.entity.test_1.duplicate');

    expect(errors.entity.test_2.t('not_found')).toBe('test.domain.entity.test_2.not_found');
    expect(errors.entity.test_2.t('duplicate')).toBe('test.domain.entity.test_2.duplicate');
    expect(errors.entity.test_2.t('custom_1')).toBe('test.domain.entity.test_2.custom_1');

    expect(errors.other_error + '').toBe('test.domain.other_error');
  });

  test('err()', () => {
    expect(errors.entity.test_1.err('not_found', 'test_data')).toEqual(ERR('test.domain.entity.test_1.not_found', 404, 'test_data'));
    expect(errors.entity.test_1.err('duplicate')).toEqual(ERR('test.domain.entity.test_1.duplicate', 400));

    expect(errors.entity.test_2.err('not_found', 'test_data')).toEqual(ERR('test.domain.entity.test_2.not_found', 404, 'test_data'));
    expect(errors.entity.test_2.err('duplicate')).toEqual(ERR('test.domain.entity.test_2.duplicate', 400));
    expect(errors.entity.test_2.err('custom_1')).toEqual(ERR('test.domain.entity.test_2.custom_1', 400));

    expect(errors.other_error.err()).toEqual(ERR('test.domain.other_error', 400));
  });

  test('erra()', async() => {
    expect(await errors.entity.test_1.erra('not_found', 'test_data')).toEqual(ERR('test.domain.entity.test_1.not_found', 404, 'test_data'));
    expect(await errors.entity.test_1.erra('duplicate')).toEqual(ERR('test.domain.entity.test_1.duplicate', 400));

    expect(await errors.entity.test_2.erra('not_found', 'test_data')).toEqual(ERR('test.domain.entity.test_2.not_found', 404, 'test_data'));
    expect(await errors.entity.test_2.erra('duplicate')).toEqual(ERR('test.domain.entity.test_2.duplicate', 400));
    expect(await errors.entity.test_2.erra('custom_1')).toEqual(ERR('test.domain.entity.test_2.custom_1', 400));

    expect(await errors.other_error.erra()).toEqual(ERR('test.domain.other_error', 400));
  });

  test('Use in object as property name', () => {
    const objectStringProp = {
      [errors.entity.test_1.t('duplicate')]: 'entity',
      [errors.other_error]: 'test',
    };

    const expected = {
      'test.domain.entity.test_1.duplicate': 'entity',
      'test.domain.other_error': 'test',
    };
    expect(objectStringProp).toEqual(expected);
  });
});
