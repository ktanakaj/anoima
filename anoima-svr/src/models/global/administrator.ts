/**
 * 管理者モデルクラスのSequelizeモジュール。
 * @module ./models/global/administrator
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import * as crypto from "crypto";
import * as config from 'config';
import * as S from 'string';
import * as Random from 'random-js';
import { AdministratorModel, AdministratorInstance, AdministratorAttributes } from '../types';
const random = new Random();

/**
 * インスタンス内のパスワードをハッシュ化する。
 * @param admin 更新されるユーザー。
 */
function beforeSave(admin: AdministratorInstance) {
	// 新しいパスワードが設定されている場合、自動でハッシュ化する
	if (admin.password != undefined && admin.password != "" && admin.password != admin.previous("password")) {
		admin.hashPassword();
	}
}

export default function (sequelize: Sequelize.Sequelize) {
	const Administrator = <AdministratorModel>sequelize.define<AdministratorInstance, AdministratorAttributes>(
		'administrator',
		{
			// 列定義
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: "管理者ID",
			},
			mailAddress: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				comment: "メールアドレス",
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: "パスワード",
			},
			role: {
				type: Sequelize.ENUM,
				values: ['normal', 'super'],
				defaultValue: 'normal',
				allowNull: false,
				comment: "権限",
			},
		},
		{
			// クラスオプション
			comment: "管理者",
			paranoid: true,
			defaultScope: {
				attributes: {
					exclude: ['password'],
				},
				order: [['id', 'ASC']],
			},
			scopes: {
				login: {
					attributes: {
						include: ['password'],
					},
				},
			},
			hooks: {
				beforeCreate: beforeSave,
				beforeUpdate: beforeSave,
			},
			instanceMethods: {
				comparePassword: function (password: string): boolean {
					if (this.password === null) {
						throw new Error("this.password is unloaded");
					}
					// salt;ハッシュ値 のデータからsaltを取り出し、そのsaltで計算した結果と比較
					return this.password == Administrator.passwordToHash(password, this.password.split(";")[0]);
				},
				hashPassword: function (): void {
					if (this.password === null) {
						throw new Error("this.password is unseted");
					}
					this.password = Administrator.passwordToHash(this.password);
				},
			},
			classMethods: {
				passwordToHash: function (password: string, salt?: string): string {
					if (salt === undefined) {
						// ※ @types の1.0.8現在、何故か引数が逆になっているのでanyで回避
						const r: any = random;
						salt = r.string(4, '0123456789ABCDEF');
					}
					const hashGenerator = crypto.createHash(config['password']['algorithm']);
					hashGenerator.update(salt);
					hashGenerator.update(password);
					return salt + ";" + hashGenerator.digest('hex');
				},
			},
		}
	);
	return Administrator;
};
