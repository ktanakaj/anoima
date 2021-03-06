/**
 * DBモデルのビジネスロジックのNode.jsモジュール。
 * @module ./models
 */
import * as Random from 'random-js';
import global from '../global';
import shardable from '../shardable';
import { randomDb } from '../shardable';
import * as t from '../types';
import objectUtils from '../../libs/object-utils';
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
async function randomPeople(limit: number): Promise<t.PersonInstance[]> {
	// ランダムで良いので、シャーディングされたテーブルのうち
	// どれかから公開のものを指定件数取得する
	const db = randomDb();
	let people = await shardable[db].Person.random(limit)

	// 運用初期などデータが足りない場合は、全DBを参照
	// （データが少なければパフォーマンス問題もないので）
	for (let i = 0; people.length < limit && i < shardable.length; i++) {
		if (i !== db) {
			let add = await shardable[i].Person.random(limit);
			people = people.concat(add);
		}
	}
	people = people.slice(0, limit);

	// キー取得のために、関連するマップを一括取得してマージ
	if (people.length > 0) {
		const personMaps = await PersonMap.findAll({
			where: {
				id: {
					$in: people.map((p) => p.id),
				},
			},
		});
		objectUtils.mergeArray(people, personMaps, 'id', 'id', 'map');
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
	const err = await shardable[0].Person.build(data).validate({ skip: ['id'] });
	if (err) {
		throw err;
	}

	// ランダムなキー/DBでマップを作成
	const map = await PersonMap.randomCreate();

	// あの人情報本体を登録
	const Person = shardable[map.no].Person;
	data.id = map.id;
	const result = await Person.create(data);
	result.map = map;
	return result;
}

export default {
	randomPeople: randomPeople,
	createPerson: createPerson,
};
