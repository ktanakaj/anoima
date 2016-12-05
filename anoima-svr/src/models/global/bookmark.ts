/**
 * ブックマークモデルクラスのSequelizeモジュール。
 * @module ./models/global/bookmark
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import objectUtils from '../../libs/object-utils';

export default function (sequelize: Sequelize.Sequelize) {
	/**
	 * ブックマークモデル。
	 * @class
	 */
	const Bookmark = sequelize.define('bookmark', {
		// 列定義
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			comment: "ブックマークID",
		},
		userId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			comment: "ユーザーID",
		},
		personId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			comment: "あの人ID",
		},
	}, {
		// クラスオプション
		comment: "ブックマーク",
		updatedAt: false,
		indexes: [
			{
				fields: ["userId", "personId"],
				unique: true,
			},
		],
	});

	return Bookmark;
};
