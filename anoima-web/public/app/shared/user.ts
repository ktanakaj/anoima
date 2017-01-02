/**
 * ユーザー関連オブジェクトの型定義ファイル。
 * @module ./app/shared/user
 */

/**
 * ユーザー。
 */
export interface User {
	id?: number;
	platform?: string;
	platformId?: string;
	note?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

/**
 * ブックマーク。
 */
export interface Bookmark {
	id?: number;
	userId?: number;
	personId?: number;
	createdAt?: Date;
}
