/**
 * ブックマークモデルクラスのSequelizeモジュール。
 * @module ./models/global/bookmark
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import { BookmarkModel, BookmarkInstance, BookmarkAttributes } from '../types';

export default function (sequelize: Sequelize.Sequelize) {
	const Bookmark = <BookmarkModel>sequelize.define<BookmarkInstance, BookmarkAttributes>(
		'bookmark',
		{
			// 列定義
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "ブックマークID",
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: "ユーザーID",
			},
			personId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: "あの人ID",
			},
		},
		{
			// クラスオプション
			comment: "ブックマーク",
			updatedAt: false,
			scopes: {
				byUser: (userId: number) => {
					return {
						where: {
							userId: userId,
						},
						include: [{
							model: sequelize.model('personMap'),
							as: 'personMap',
							required: true,
						}],
						order: [['id', 'DESC']],
					};
				},
			},
			instanceMethods: {
				toJSON: function (): Object {
					// まずデータをコピー（標準の動作）
					const o = Object.assign({}, this.dataValues);
					// その他、独自に詰めている値もあれば出す
					for (let key of ['person', 'personMap']) {
						if (this[key] !== undefined) {
							o[key] = this[key];
						}
					}
					return o;
				},
			},
			classMethods: {
				findAllByUser: async function (userId: number, options?: Sequelize.FindOptions): Promise<BookmarkInstance[]> {
					const bookmarks = await Bookmark.scope({ method: ['byUser', userId] }).findAll(options);
					// ※ 厳密には削除されたユーザーがいるとlimitと一致しないけど、とりあえず許容する
					const results = [];
					// TODO: n+1問題解消
					for (let bookmark of bookmarks) {
						bookmark.person = await bookmark.personMap.getPerson();
						if (bookmark.person) {
							delete bookmark.personMap;
							results.push(bookmark);
						}
					}
					return results;
				},
			},
			indexes: [
				{
					fields: ["userId", "personId"],
					unique: true,
				},
			],
		}
	);
	return Bookmark;
};
