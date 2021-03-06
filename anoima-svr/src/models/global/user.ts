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
					exclude: ['platformId', 'accessToken', 'refreshToken', 'note'],
				},
			},
			scopes: {
				withToken: {
					attributes: {
						include: ['platformId', 'accessToken', 'refreshToken'],
					},
				},
				withPrivate: {
					attributes: {
						include: ['platformId', 'note'],
					},
					order: [['platform', 'ASC'], ['platformId', 'ASC']],
				},
			},
			classMethods: {
				createOrUpdateUser: async function (platform, platformId, accessToken, refreshToken): Promise<UserInstance> {
					const options = {
						where: { platform: platform, platformId: platformId },
						paranoid: false,
					};
					const result = await User.findOrInitialize(options);
					const user = result[0];
					if (user.deletedAt) {
						// 削除ユーザー=BANなので再登録不可
						// TODO: 403 を返したいので区別できるエラーにする
						throw new Error("This user can't be registered");
					}
					user.platform = platform;
					user.platformId = platformId;
					user.accessToken = accessToken;
					user.refreshToken = refreshToken;
					return user.save();
				}
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
