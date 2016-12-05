/**
 * ユーザーモデルクラスのSequelizeモジュール。
 * @module ./models/global/user
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import objectUtils from '../../libs/object-utils';

interface UserAttributes {
	id?: number;
	accessToken?: string;
	accessSecret?: string;
	note?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

interface UserInstance extends Sequelize.Instance<UserAttributes> { }

export default function (sequelize: Sequelize.Sequelize) {
	/**
	 * ユーザーモデル。
	 * @class
	 */
	const User = sequelize.define<UserInstance, UserAttributes>('user', {
		// 列定義
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			comment: "ユーザーID",
		},
		accessToken: {
			type: Sequelize.STRING(100),
			allowNull: false,
			unique: true,
			comment: "アクセストークン",
		},
		accessSecret: {
			type: Sequelize.STRING(100),
			allowNull: false,
			comment: "アクセスシークレット",
		},
		note: {
			type: Sequelize.TEXT,
			comment: "ノート",
		},
	}, {
		// クラスオプション
		comment: "ユーザー",
		paranoid: true,
	});

	return User;
};
