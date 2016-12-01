/**
 * あの人モデルクラスのSequelizeモジュール。
 * @module ./models/shardable/person
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import objectUtils from '../../libs/object-utils';

export default function (sequelize) {
	/**
	 * あの人モデル。
	 * @class
	 */
	const Person = sequelize.define('person', {
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
	});
	return Person;
};
