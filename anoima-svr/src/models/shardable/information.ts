/**
 * あの人情報モデルクラスのSequelizeモジュール。
 * @module ./models/shardable/information
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import { InformationModel, InformationInstance, InformationAttributes } from '../types';

export default function (sequelize: Sequelize.Sequelize) {
	const Information = <InformationModel>sequelize.define<InformationInstance, InformationAttributes>(
		'information',
		{
			// 列定義
			id: {
				type: Sequelize.BIGINT.UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "あの人情報ID",
			},
			personId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: "あの人ID",
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
				comment: "情報本文",
			},
			data: {
				type: Sequelize.BLOB,
				comment: "画像などのデータ",
			},
		},
		{
			// クラスオプション
			comment: "あの人情報",
			paranoid: true,
			instanceMethods: {
				toJSON: function (): Object {
					// まずデータをコピー（標準の動作）
					const o = Object.assign({}, this.dataValues);
					// その他、独自に詰めている値もあれば出す
					for (let key of ['comments']) {
						if (this[key] !== undefined) {
							o[key] = this[key];
						}
					}
					return o;
				},
			},
		}
	);
	return Information;
};
