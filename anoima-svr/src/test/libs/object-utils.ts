/**
 * @file object-utils.tsのテスト。
 */
import * as assert from 'power-assert';
import objectUtils from '../../libs/object-utils';

describe('object-utils', () => {
	describe('#get()', () => {
		it('should get recursive value', () => {
			let obj = { info: { data: { id: 10 }, data2: null } };
			assert.strictEqual(objectUtils.get(obj, "info.data.id"), 10);
			assert.strictEqual(objectUtils.get(obj, "info.data.invalid"), undefined);
			assert.strictEqual(objectUtils.get(obj, "info.data2.id"), undefined);
			assert.strictEqual(objectUtils.get(obj, "info.invalid"), undefined);
			assert.strictEqual(objectUtils.get(obj, "info.invalid.id"), undefined);
			assert.strictEqual(objectUtils.get(obj, "info.data2"), null);
			assert.deepStrictEqual(objectUtils.get(obj, "info.data"), { id: 10 });
			assert.deepStrictEqual(objectUtils.get(obj, "info"), { data: { id: 10 }, data2: null });
			assert.strictEqual(objectUtils.get(obj, "."), undefined);
		});
	});

	describe('#set()', () => {
		it('should set recursive value', () => {
			let obj = { info: { data: { id: 10 }, data2: null } };
			objectUtils.set(obj, "info.data.id", 11);
			assert.strictEqual(obj.info['data']['id'], 11);
			objectUtils.set(obj, "info.data.value", "test");
			assert.strictEqual(obj.info['data']['value'], "test");
			objectUtils.set(obj, "info.data2.id", 25);
			assert.strictEqual(obj.info['data2']['id'], 25);
			objectUtils.set(obj, "info.data3.value", 1500);
			assert.strictEqual(obj.info['data3']['value'], 1500);
			objectUtils.set(obj, "info.comment", "test comment");
			assert.strictEqual(obj.info['comment'], "test comment");
			assert.deepStrictEqual(obj, { info: { data: { id: 11, value: "test" }, data2: { id: 25 }, data3: { value: 1500 }, comment: "test comment" } });
		});
	});
});