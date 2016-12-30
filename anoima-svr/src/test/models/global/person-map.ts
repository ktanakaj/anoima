/**
 * @file person-map.tsのテスト。
 */
import * as assert from 'power-assert';
import { global } from '../../../models';
const PersonMap = global.PersonMap;

describe('PersonMap', () => {
	describe('#randomCreate()', () => {
		it('should create random no data', async function () {
			// ※ ランダムなので100回やって全部同じDBという可能性も0ではないけど許容する
			const MAX = 100;
			let noCounters = {};
			for (let i = 0; i < MAX; i++) {
				let map = await PersonMap.randomCreate();
				if (noCounters[map.no] === undefined) {
					noCounters[map.no] = 0;
				}
				++noCounters[map.no];
			}
			assert(Object.keys(noCounters).length > 1);
		});
	});
});