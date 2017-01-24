/**
 * 管理者関連オブジェクトの型定義ファイル。
 * @module ./app/admin/shared/administrator
 */

/**
 * 管理者。
 */
export interface Administrator {
	id?: number;
	mailAddress?: string;
	password?: string;
	role?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}
