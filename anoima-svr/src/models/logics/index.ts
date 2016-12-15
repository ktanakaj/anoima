/**
 * DBモデルのビジネスロジックのNode.jsモジュール。
 * @module ./models
 */
import numberUtils from '../../libs/number-utils';
import global from '../global';
import shardable from '../shardable';
import * as t from '../types';

// ビジネスロジックは基本的にモデルに実装する方針だが、
// シャーディングの関係上、DB横断の処理も発生するため、
// それらはこちらに実装する。

/**
 * 公開設定のあの人IDをランダムで指定件数だけ取得する。
 * @param limit 取得件数。
 * @returns あの人配列。
 */
async function randomPeople(limit: number = 20): Promise<t.PersonInstance[]> {
	// ランダムで良いので、シャーディングされたテーブルのうち
	// どれかから公開のものを指定件数取得する
	const db = numberUtils.randomInt(0, shardable.length - 1);
	let people = await shardable[db].Person.randam(limit)

	// 運用初期などデータが足りない場合は、全DBを参照
	// （データが少なければパフォーマンス問題もないので）
	for (let i = 0; people.length < limit && i < shardable.length; i++) {
		if (i !== db) {
			let add = await shardable[i].Person.randam(limit);
			people.concat(add);
		}
	}
	people = people.slice(0, limit);

	// キー取得のために、関連するマップを一括取得してマージ
	if (people.length > 0) {
		const personMaps = await global.PersonMap.findAll({
			where: {
				id: {
					$in: people.map((p) => p['id']),
				},
			},
		})
	}
	return people;
}

export default {
	randomPeople: randomPeople,
};
