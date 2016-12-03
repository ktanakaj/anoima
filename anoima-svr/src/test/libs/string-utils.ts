/**
 * @file string-utils.tsのテスト。
 */
import * as assert from 'power-assert';
import stringUtils from '../../libs/string-utils';

describe('string-utils', () => {
	describe('#camelize()', () => {
		it('should return camelized value', () => {
			assert.equal(stringUtils.camelize("testStr"), "testStr");
			assert.equal(stringUtils.camelize("test str"), "testStr");
			assert.equal(stringUtils.camelize("test_str"), "testStr");
			assert.equal(stringUtils.camelize("teststr"), "teststr");
			assert.equal(stringUtils.camelize("test-str"), "testStr");
			assert.equal(stringUtils.camelize("test_str-new"), "testStrNew");
		});
	});
});