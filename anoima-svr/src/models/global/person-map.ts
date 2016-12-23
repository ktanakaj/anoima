/**
 * あの人ID-キーマッピングモデルクラスのSequelizeモジュール。
 * @module ./models/global/person-map
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import * as Random from 'random-js';
import objectUtils from '../../libs/object-utils';
import shardable from '../shardable';
import { randomDb } from '../shardable';
import { PersonMapModel, PersonMapInstance, PersonMapAttributes, PersonInstance } from '../types';
const random = new Random();

export default function (sequelize: Sequelize.Sequelize) {
	/**
	 * あの人ID-キーマッピングモデル。
	 * @class
	 */
	const PersonMap = <PersonMapModel>sequelize.define<PersonMapInstance, PersonMapAttributes>(
		'personMap',
		{
			// 列定義
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "あの人ID",
			},
			key: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				comment: "あの人キー",
			},
			no: {
				type: Sequelize.INTEGER(2),
				allowNull: false,
				defaultValue: 0,
				comment: "DB番号",
			},
		},
		{
			// クラスオプション
			comment: "あの人ID-キーマッピング",
			instanceMethods: {
				/**
				 * あの人情報を取得する。
				 * @function getPerson
				 * @returns あの人インスタンス。
				 */
				getPerson: async function (): Promise<PersonInstance> {
					return shardable[this.no].Person.findById(this.id);
				},
			},
			classMethods: {
				/**
				 * あの人ID-キーマッピングを取得する。
				 * @function findByKey
				 * @returns あの人ID-キーマッピングインスタンス。
				 */
				findByKey: async function (key): Promise<PersonMapInstance> {
					return PersonMap.findOne({ where: { key: key } });
				},
				/**
				 * ランダムなKEY/DBであの人ID-キーマッピングを生成する。
				 * @function randomCreate
				 * @returns あの人ID-キーマッピングインスタンス。
				 */
				randomCreate: async function (): Promise<PersonMapInstance> {
					const no = randomDb();
					while (true) {
						// キーが重複していたら重複しなくなるまでループ
						const key = PersonMap.makeKey();
						try {
							return await PersonMap.create({
								key: key,
								no: no,
							});
						} catch (e) {
							if (e.name !== "SequelizeUniqueConstraintError") {
								throw e;
							}
						}
					}
				},
				/**
				 * ランダムなあの人キーを生成する。
				 * @function makeKey
				 * @returns 生成したあの人キー。
				 */
				makeKey: function (): string {
					return random.string("abcdefghijklmnopqrstuvwxyz0123456789", 16);
				},
			},
		});

	return PersonMap;
};
