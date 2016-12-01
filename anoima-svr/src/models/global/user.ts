"use strict";
/**
 * ユーザーモデルクラスのSequelizeモジュール。
 * @module ./models/global/user
 * @param {Sequelize} sequelize Sequelizeインスタンス。
 * @returns {Object} モデルクラス定義。
 */
const Sequelize = require('sequelize');
const objectUtils = require('../libs/object-utils');

module.exports = function (sequelize) {
	/**
	 * ユーザーモデル。
	 * @class
	 */
	const User = sequelize.define('user', {
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
