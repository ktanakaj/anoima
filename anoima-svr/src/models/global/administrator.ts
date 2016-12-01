/**
 * 管理者モデルクラスのSequelizeモジュール。
 * @module ./models/global/administrator
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import objectUtils from '../../libs/object-utils';

export default function (sequelize) {
	/**
	 * 管理者モデル。
	 * @class
	 */
	const Administrator = sequelize.define('administrator', {
		// 列定義
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			comment: "管理者ID",
		},
		mailAddress: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
			comment: "メールアドレス",
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false,
			comment: "パスワード",
		},
	}, {
		// クラスオプション
		comment: "管理者",
		paranoid: true,
	});

	return Administrator;
};
