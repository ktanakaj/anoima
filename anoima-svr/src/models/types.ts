/**
 * DBモデルの型定義のNode.jsモジュール。
 * @module ./models/types
 */
// ※ 個別ソースに書きたいが、sequelize.importで呼び出す都合上他のファイルから参照できないので、ここに集約
import * as Sequelize from 'sequelize';

export interface PersonMapAttributes {
	id?: number;
	ownerId?: number;
	name?: string;
	privacy?: string;
	text?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

export interface PersonMapInstance extends Sequelize.Instance<PersonMapAttributes> {
	getPerson(): Promise<PersonInstance>;
 }

export interface PersonMapModel extends Sequelize.Model<PersonMapInstance, PersonMapAttributes> {
	findByKey(key: string): Promise<PersonMapInstance>;
 }

export interface PersonAttributes {
	id?: number;
	ownerId?: number;
	name?: string;
	privacy?: string;
	text?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

export interface PersonInstance extends Sequelize.Instance<PersonAttributes> { }

export interface PersonModel extends Sequelize.Model<PersonInstance, PersonAttributes> {
	randam(limit: number): Promise<PersonInstance[]>;
}

export interface InformationAttributes {
	id?: number;
	personId?: number;
	ownerId?: number;
	releationship?: string;
	text?: string;
	data?: Object;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

export interface InformationInstance extends Sequelize.Instance<InformationAttributes> { }

export interface InformationModel extends Sequelize.Model<InformationInstance, InformationAttributes> { }

export interface CommentAttributes {
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

export interface CommentInstance extends Sequelize.Instance<CommentAttributes> { }

export interface CommentModel extends Sequelize.Model<CommentInstance, CommentAttributes> { }

export interface VoteAttributes {
	id?: number;
	informationId?: number;
	ownerId?: number;
	type?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface VoteInstance extends Sequelize.Instance<VoteAttributes> { }

export interface VoteModel extends Sequelize.Model<VoteInstance, VoteAttributes> { }

export interface UserAttributes {
	id?: number;
	accessToken?: string;
	accessSecret?: string;
	note?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

export interface UserInstance extends Sequelize.Instance<UserAttributes> { }

export interface UserModel extends Sequelize.Model<UserInstance, UserAttributes> { }

export interface BookmarkAttributes {
	id?: number;
	userId?: number;
	personId?: number;
	createdAt?: Date;
}

export interface BookmarkInstance extends Sequelize.Instance<BookmarkAttributes> { }

export interface BookmarkModel extends Sequelize.Model<BookmarkInstance, BookmarkAttributes> { }

export interface AdministratorAttributes {
	id?: number;
	mailAddress?: string;
	password?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

export interface AdministratorInstance extends Sequelize.Instance<AdministratorAttributes> { }

export interface AdministratorModel extends Sequelize.Model<AdministratorInstance, AdministratorAttributes> { }
