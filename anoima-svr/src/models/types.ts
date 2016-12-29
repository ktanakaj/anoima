/**
 * DBモデルの型定義のNode.jsモジュール。
 * @module ./models/types
 */
// ※ 個別ソースに書きたいが、sequelize.importで呼び出す都合上他のファイルから参照できないので、ここに集約
//    また、JSDocもモデル側に書きたいがIDEなどが参照するのはこちらなので、こちらに書く
import * as Sequelize from 'sequelize';

/**
 * あの人ID-キーマッピング属性値。
 */
export interface PersonMapAttributes {
	id?: number;
	key?: string;
	no?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * あの人ID-キーマッピングインスタンス。
 */
export interface PersonMapInstance extends Sequelize.Instance<PersonMapAttributes>, PersonMapAttributes {
	/**
	 * あの人情報を取得する。
	 * @returns あの人インスタンス。
	 */
	getPerson(): Promise<PersonInstance>;
}

/**
 * あの人ID-キーマッピングモデル。
 */
export interface PersonMapModel extends Sequelize.Model<PersonMapInstance, PersonMapAttributes> {
	/**
	 * あの人ID-キーマッピングを取得する。
	 * @param key あの人キー。
	 * @returns あの人ID-キーマッピングインスタンス。
	 */
	findByKey(key: string): Promise<PersonMapInstance>;
	/**
	 * あの人一覧をマップから取得する。
	 * @param options 検索オプション。※PersonMapの検索に用いられる
	 * @returns あの人配列。
	 */
	findAllWithPerson(options?: Sequelize.FindOptions): Promise<PersonInstance[]>;
	/**
	 * ランダムなKEY/DBであの人ID-キーマッピングを生成する。
	 * @returns あの人ID-キーマッピングインスタンス。
	 */
	randomCreate(): Promise<PersonMapInstance>;
	/**
	 * ランダムなあの人キーを生成する。
	 * @returns 生成したあの人キー。
	 */
	makeKey(): string;
}

/**
 * あの人属性値。
 */
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

/**
 * あの人インスタンス。
 */
export interface PersonInstance extends Sequelize.Instance<PersonAttributes>, PersonAttributes {
	map?: PersonMapInstance;
}

/**
 * あの人モデル。
 */
export interface PersonModel extends Sequelize.Model<PersonInstance, PersonAttributes> {
	/**
	 * 公開設定のあの人IDをランダムで指定件数だけ取得する。
	 * @param limit 取得件数。
	 * @returns あの人インスタンス配列。
	 */
	random(limit: number): Promise<PersonInstance[]>;
}

/**
 * あの人情報属性値。
 */
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

/**
 * あの人情報インスタンス。
 */
export interface InformationInstance extends Sequelize.Instance<InformationAttributes>, InformationAttributes { }

/**
 * あの人情報モデル。
 */
export interface InformationModel extends Sequelize.Model<InformationInstance, InformationAttributes> { }

/**
 * あの人or情報へのコメント属性値。
 */
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

/**
 * あの人or情報へのコメントインスタンス。
 */
export interface CommentInstance extends Sequelize.Instance<CommentAttributes>, CommentAttributes { }

/**
 * あの人or情報へのコメントモデル。
 */
export interface CommentModel extends Sequelize.Model<CommentInstance, CommentAttributes> { }

/**
 * あの人情報への投票属性値。
 */
export interface VoteAttributes {
	id?: number;
	informationId?: number;
	ownerId?: number;
	type?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

/**
 * あの人情報への投票インスタンス。
 */
export interface VoteInstance extends Sequelize.Instance<VoteAttributes>, VoteAttributes { }

/**
 * あの人情報への投票モデル。
 */
export interface VoteModel extends Sequelize.Model<VoteInstance, VoteAttributes> { }

/**
 * ユーザー属性値。
 */
export interface UserAttributes {
	id?: number;
	platform?: string;
	platformId?: string;
	accessToken?: string;
	refreshToken?: string;
	note?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

/**
 * ユーザーインスタンス。
 */
export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes { }

/**
 * ユーザーモデル。
 */
export interface UserModel extends Sequelize.Model<UserInstance, UserAttributes> {
	/**
	 * 外部プラットフォームで認証されたユーザーを登録する。
	 * @param platform プラットフォーム名。
	 * @param platformId プラットフォームでのID。
	 * @param accessToken アクセストークン。
	 * @param refreshToken リフレッシュトークン。
	 * @returns ユーザー情報。
	 * @throws アカウントがBANされている場合。
	 */
	createOrUpdateUser(platform, platformId, accessToken, refreshToken): Promise<UserInstance>;
}

/**
 * ブックマーク属性値。
 */
export interface BookmarkAttributes {
	id?: number;
	userId?: number;
	personId?: number;
	createdAt?: Date;
}

/**
 * ブックマークインスタンス。
 */
export interface BookmarkInstance extends Sequelize.Instance<BookmarkAttributes>, BookmarkAttributes {
	personMap?: PersonMapInstance;
	person?: PersonInstance;
}

/**
 * ブックマークモデル。
 */
export interface BookmarkModel extends Sequelize.Model<BookmarkInstance, BookmarkAttributes> {
	/**
	 * ユーザーのブックマーク一覧を取得する。
	 * @param options 検索オプション。※Bookmarkの検索に用いられる
	 * @returns ブックマーク配列。
	 */
	findAllByUser(userId: number, options?: Sequelize.FindOptions): Promise<BookmarkInstance[]>;
}

/**
 * 管理者属性値。
 */
export interface AdministratorAttributes {
	id?: number;
	mailAddress?: string;
	password?: string;
	role?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

/**
 * 管理者インスタンス。
 */
export interface AdministratorInstance extends Sequelize.Instance<AdministratorAttributes>, AdministratorAttributes {
	/**
	 * 渡されたパスワードを現在の値と比較する。
	 * @param password 変換するパスワード。
	 * @returns 一致する場合true。
	 * @throws パスワード未読み込み。
	 */
	comparePassword(password: string): boolean;
	/**
	 * パスワードプロパティをハッシュ化する。
	 * @throws パスワード未設定。
	 */
	hashPassword(): void;
}

/**
 * 管理者モデル。
 */
export interface AdministratorModel extends Sequelize.Model<AdministratorInstance, AdministratorAttributes> {
	/**
	 * 渡されたパスワードをハッシュ値に変換する。
	 * @param password 変換するパスワード。
	 * @param salt 変換に用いるsalt。未指定時は内部で乱数から生成。
	 * @returns saltとハッシュ値を結合した文字列。
	 */
	passwordToHash(password: string, salt?: string): string;
}
