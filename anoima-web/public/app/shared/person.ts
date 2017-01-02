/**
 * あの人関連オブジェクトの型定義ファイル。
 * @module ./app/shared/person
 */

/**
 * あの人。
 */
export interface Person {
	id?: number;
	ownerId?: number;
	name?: string;
	privacy?: string;
	text?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;

	map?: PersonMap;
	information?: Information[];
	comments?: Comment[];
}

/**
 * あの人ID-キーマッピング。
 */
export interface PersonMap {
	id?: number;
	key?: string;
	no?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * あの人情報。
 */
export interface Information {
	id?: number;
	personId?: number;
	ownerId?: number;
	releationship?: string;
	text?: string;
	data?: Object;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;

	comments?: Comment[];
}

/**
 * あの人or情報へのコメント。
 */
export interface Comment {
	id?: number;
	personId?: number;
	informationId?: number;
	ownerId?: number;
	releationship?: string;
	text?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}
