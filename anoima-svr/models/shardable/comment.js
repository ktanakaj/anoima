"use strict";
/**
 * あの人or情報へのコメントモデルクラスのSequelizeモジュール。
 * @module ./models/shardable/comment
 * @param {Sequelize} sequelize Sequelizeインスタンス。
 * @returns {Object} モデルクラス定義。
 */
const Sequelize = require('sequelize');
const objectUtils = require('../libs/object-utils');

module.exports = function(sequelize) {
	/**
	 * あの人or情報へのコメントモデル。
	 * @class
	 */
	const Comment = sequelize.define('comment', {
		// 列定義
		id: {
			type: Sequelize.BIGINT.UNSIGNED,
			allowNull: false,
			primaryKey: true,
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
	}, {
		// クラスオプション
		comment: "あの人or情報へのコメント",
		paranoid: true,
	});
	return Comment;
};
