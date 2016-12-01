/**
 * あの人ID-キーマッピングモデルクラスのSequelizeモジュール。
 * @module ./models/global/person-map
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import objectUtils from '../../libs/object-utils';

export default function (sequelize) {
	/**
	 * あの人ID-キーマッピングモデル。
	 * @class
	 */
	const PersonMap = sequelize.define('personMap', {
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
			comment: "アクセストークン",
		},
	}, {
		// クラスオプション
		comment: "あの人ID-キーマッピング",
	});

	return PersonMap;
};
