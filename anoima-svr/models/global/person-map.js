"use strict";
/**
 * あの人ID-キーマッピングモデルクラスのSequelizeモジュール。
 * @module ./models/global/person-map
 * @param {Sequelize} sequelize Sequelizeインスタンス。
 * @returns {Object} モデルクラス定義。
 */
const Sequelize = require('sequelize');
const objectUtils = require('../libs/object-utils');

module.exports = function (sequelize) {
	/**
	 * あの人ID-キーマッピングモデル。
	 * @class
	 */
	const PersonMap = sequelize.define('personMap', {
		// 列定義
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			comment: "あの人ID",
		},
		key: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
			comment: "アクセストークン",
		},
	}, {
		// クラスオプション
		comment: "あの人ID-キーマッピング",
	});

	return PersonMap;
};
