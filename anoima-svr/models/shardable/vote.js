"use strict";
/**
 * あの人情報への投票モデルクラスのSequelizeモジュール。
 * @module ./models/shardable/vote
 * @param {Sequelize} sequelize Sequelizeインスタンス。
 * @returns {Object} モデルクラス定義。
 */
const Sequelize = require('sequelize');
const objectUtils = require('../libs/object-utils');

module.exports = function(sequelize) {
	/**
	 * あの人情報への投票モデル。
	 * @class
	 */
	const Vote = sequelize.define('vote', {
		// 列定義
		id: {
			type: Sequelize.BIGINT.UNSIGNED,
			allowNull: false,
			primaryKey: true,
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
	}, {
		// クラスオプション
		comment: "あの人情報への投票",
		paranoid: true,
	});
	return Vote;
};
