/**
 * ユーザーモデルクラスのSequelizeモジュール。
 * @module ./models/global/user
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import { UserModel, UserInstance, UserAttributes } from '../types';

export default function (sequelize: Sequelize.Sequelize) {
	const User = <UserModel>sequelize.define<UserInstance, UserAttributes>(
		'user',
		{
			// 列定義
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "ユーザーID",
			},
			platform: {
				type: Sequelize.STRING(10),
				allowNull: false,
				comment: "認証プラットフォーム",
			},
			platformId: {
				type: Sequelize.STRING(255),
				allowNull: false,
				comment: "認証プラットフォームID",
			},
			accessToken: {
				type: Sequelize.STRING(255),
				allowNull: false,
				comment: "アクセストークン",
			},
			refreshToken: {
				type: Sequelize.STRING(255),
				comment: "リフレッシュトークン",
			},
			note: {
				type: Sequelize.TEXT,
				comment: "ノート",
			},
		},
		{
			// クラスオプション
			comment: "ユーザー",
			paranoid: true,
			defaultScope: {
				attributes: {
					exclude: ['accessToken', 'refreshToken'],
				},
				order: [['platform', 'ASC'], ['platformId', 'ASC']],
			},
			scopes: {
				withToken: {
					attributes: {
						include: ['accessToken', 'refreshToken'],
					},
				},
			},
			indexes: [
				{
					fields: ["platform", "platformId"],
					unique: true,
				},
			],
		}
	);
	return User;
};
