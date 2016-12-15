/**
 * あの人モデルクラスのSequelizeモジュール。
 * @module ./models/shardable/person
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import objectUtils from '../../libs/object-utils';
import arrayUtils from '../../libs/array-utils';
import numberUtils from '../../libs/number-utils';
import { PersonInstance, PersonAttributes } from '../types';

export default function (sequelize: Sequelize.Sequelize) {
	/**
	 * あの人モデル。
	 * @class
	 */
	const Person = sequelize.define<PersonInstance, PersonAttributes>('person', {
		// 列定義
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			comment: "あの人ID",
		},
		ownerId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			comment: "所有者ID",
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			comment: "あの人の名前",
		},
		privacy: {
			type: Sequelize.ENUM,
			values: ['public', 'private'],
			defaultValue: 'private',
			allowNull: false,
			comment: "公開設定",
		},
		text: {
			type: Sequelize.TEXT,
			comment: "あの人の説明",
		},
	}, {
		// クラスオプション
		comment: "あの人",
		paranoid: true,
		scopes: {
			public: {
				where: {
					privacy: 'public',
				},
			},
		},
		classMethods: {
			/**
			 * 公開設定のあの人IDをランダムで指定件数だけ取得する。
			 * @function randam
			 * @returns あの人インスタンス配列。
			 */
			randam: async function (limit): Promise<PersonInstance[]> {
				// ※ 厳密にランダムである必要はないので、
				//    ランダムなとこから指定件数*2ぐらいでとって、
				//    その中からランダムなデータを返す。
				//    （性能問題対策）
				const dbLimit = limit * 2;
				const count = await Person.scope('public').count();
				const max = count - dbLimit;
				const offset = max > 0 ? numberUtils.randomInt(0, max) : 0;
				const results = await Person.scope('public').findAll({
					offset: offset,
					limit: dbLimit,
				});
				arrayUtils.shuffle(results);
				return results.slice(0, limit);
			},
		},
	});
	return Person;
};
