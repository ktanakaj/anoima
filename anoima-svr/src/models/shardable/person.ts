/**
 * あの人モデルクラスのSequelizeモジュール。
 * @module ./models/shardable/person
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import * as Random from 'random-js';
import { PersonModel, PersonInstance, PersonAttributes } from '../types';
const random = new Random();

export default function (sequelize: Sequelize.Sequelize) {
	const Person = <PersonModel>sequelize.define<PersonInstance, PersonAttributes>(
		'person',
		{
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
		},
		{
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
			instanceMethods: {
				toJSON: function (): Object {
					// まずデータをコピー（標準の動作）
					const o = Object.assign({}, this.dataValues);
					// その他、独自に詰めている値もあれば出す
					for (let key of ['map', 'information', 'comments']) {
						if (this[key] !== undefined) {
							o[key] = this[key];
						}
					}
					return o;
				},
			},
			classMethods: {
				random: async function (limit: number): Promise<PersonInstance[]> {
					// ※ 厳密にランダムである必要はないので、
					//    ランダムなとこから指定件数*2ぐらいでとって、
					//    その中からランダムなデータを返す。
					//    （性能問題対策）
					const dbLimit = limit * 2;
					const count = await Person.scope('public').count();
					const max = count - dbLimit;
					const offset = max > 0 ? random.integer(0, max) : 0;
					const results = await Person.scope('public').findAll({
						offset: offset,
						limit: dbLimit,
					});
					// ※ @types の1.0.8現在、何故かメソッド定義が無いのでanyで回避
					const r: any = random;
					return r.shuffle(results).slice(0, limit);
				},
			},
		}
	);
	return Person;
};
