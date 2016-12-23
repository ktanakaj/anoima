/**
 * DBモデルのビジネスロジックのNode.jsモジュール。
 * @module ./models
 */
import * as Random from 'random-js';
import global from '../global';
import shardable from '../shardable';
import { randomDb } from '../shardable';
import * as t from '../types';
const random = new Random();
const PersonMap = global.PersonMap;

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
	const db = randomDb();
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
					$in: people.map((p) => p.id),
				},
			},
		})
	}
	return people;
}

/**
 * あの人情報を新規登録する。
 * @param person あの人情報。
 * @returns 生成したインスタンス。
 */
async function createPerson(person: t.PersonAttributes): Promise<t.PersonInstance> {
	// シャーディングしているため、先にマップでIDを発行して、
	// そのIDでデータ本体を作成する。
	// （通常のトランザクションは使えないが、ゴミマップが残ってもデータ容量以外害はないので無視する）

	// 適当なDBで仮にモデルを作ってまずバリデーション
	const data = Object.assign({}, person);
	shardable[0].Person.build(data).validate({ skip: ['id'] });

	// ランダムなキー/DBでマップを作成
	const map = await PersonMap.randamCreate();

	// あの人情報本体を登録
	const Person = shardable[map.no].Person;
	data.id = map.id;
	const result = await Person.create(data, { fields: ['id', 'ownerId', 'name', 'privacy', 'text'] });
	result.map = map;
	return result;
}

export default {
	randomPeople: randomPeople,
	createPerson: createPerson,
};
