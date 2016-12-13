/**
 * あの人ID-キーマッピングモデルクラスのSequelizeモジュール。
 * @module ./models/global/person-map
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import * as Promise from "bluebird";
import objectUtils from '../../libs/object-utils';
import shardable from '../shardable';
import { PersonMapInstance, PersonMapAttributes, PersonInstance } from '../types';

export default function (sequelize: Sequelize.Sequelize) {
	/**
	 * あの人ID-キーマッピングモデル。
	 * @class
	 */
	const PersonMap = sequelize.define<PersonMapInstance, PersonMapAttributes>('personMap', {
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
	}, {
		// クラスオプション
		comment: "あの人ID-キーマッピング",
		instanceMethods: {
			/**
			 * あの人情報を取得する。
			 * @function getPerson
			 * @returns あの人インスタンス。
			 */
			getPerson: function (): Promise<PersonInstance> {
				return shardable[this.no].Person.findById(this.id);
			},
		},
		classMethods: {
			/**
			 * あの人ID-キーマッピングを取得する。
			 * @function findByKey
			 * @returns あの人ID-キーマッピングインスタンス。
			 */
			findByKey: function (key): Promise<PersonMapInstance> {
				return PersonMap.findOne({ where: { key: key }});
			},
		},
	});

	return PersonMap;
};
