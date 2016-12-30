/**
 * あの人or情報へのコメントモデルクラスのSequelizeモジュール。
 * @module ./models/shardable/comment
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import { CommentModel, CommentInstance, CommentAttributes } from '../types';

export default function (sequelize: Sequelize.Sequelize) {
	const Comment = <CommentModel>sequelize.define<CommentInstance, CommentAttributes>(
		'comment',
		{
			// 列定義
			id: {
				type: Sequelize.BIGINT.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "あの人or情報へのコメントID",
			},
			personId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: "あの人ID",
			},
			informationId: {
				type: Sequelize.BIGINT.UNSIGNED,
				comment: "あの人情報ID",
			},
			ownerId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: "投稿者ID",
			},
			releationship: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: "あの人との関係",
			},
			text: {
				type: Sequelize.TEXT,
				comment: "コメント本文",
			},
		},
		{
			// クラスオプション
			comment: "あの人or情報へのコメント",
			paranoid: true,
		}
	);
	return Comment;
};
