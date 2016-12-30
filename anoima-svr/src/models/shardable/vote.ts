/**
 * あの人情報への投票モデルクラスのSequelizeモジュール。
 * @module ./models/shardable/vote
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import { VoteModel, VoteInstance, VoteAttributes } from '../types';

export default function (sequelize: Sequelize.Sequelize) {
	const Vote = <VoteModel>sequelize.define<VoteInstance, VoteAttributes>(
		'vote',
		{
			// 列定義
			id: {
				type: Sequelize.BIGINT.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "あの人情報への投票ID",
			},
			informationId: {
				type: Sequelize.BIGINT.UNSIGNED,
				allowNull: false,
				comment: "あの人情報ID",
			},
			ownerId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: "投票者ID",
			},
			type: {
				type: Sequelize.ENUM,
				values: ['good', 'bad'],
				defaultValue: 'good',
				allowNull: false,
				comment: "投票の種類",
			},
		},
		{
			// クラスオプション
			comment: "あの人情報への投票",
			paranoid: true,
		}
	);
	return Vote;
};
