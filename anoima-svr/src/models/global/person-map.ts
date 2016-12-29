/**
 * あの人ID-キーマッピングモデルクラスのSequelizeモジュール。
 * @module ./models/global/person-map
 * @param sequelize Sequelizeインスタンス。
 * @returns モデルクラス定義。
 */
import * as Sequelize from 'sequelize';
import * as Random from 'random-js';
import shardable from '../shardable';
import { randomDb } from '../shardable';
import { PersonMapModel, PersonMapInstance, PersonMapAttributes, PersonInstance } from '../types';
const random = new Random();

export default function (sequelize: Sequelize.Sequelize) {
	const PersonMap = <PersonMapModel>sequelize.define<PersonMapInstance, PersonMapAttributes>(
		'personMap',
		{
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
				comment: "あの人キー",
			},
			no: {
				type: Sequelize.INTEGER(2),
				allowNull: false,
				defaultValue: 0,
				comment: "DB番号",
			},
		},
		{
			// クラスオプション
			comment: "あの人ID-キーマッピング",
			instanceMethods: {
				getPerson: async function (): Promise<PersonInstance> {
					const person = await shardable[this.no].Person.findById(this.id);
					if (person) {
						person.map = this;
					}
					return person;
				},
			},
			classMethods: {
				findByKey: async function (key: string): Promise<PersonMapInstance> {
					return PersonMap.findOne({ where: { key: key } });
				},
				findAllWithPerson: async function (options?: Sequelize.FindOptions): Promise<PersonInstance[]> {
					const personMaps = await PersonMap.findAll(options);
					const people = [];
					// TODO: n+1問題解消
					for (let personMap of personMaps) {
						let person = await personMap.getPerson();
						if (person) {
							people.push(person);
						}
					}
					return people;
				},
				randomCreate: async function (): Promise<PersonMapInstance> {
					const no = randomDb();
					while (true) {
						// キーが重複していたら重複しなくなるまでループ
						const key = PersonMap.makeKey();
						try {
							return await PersonMap.create({
								key: key,
								no: no,
							});
						} catch (e) {
							if (e.name !== "SequelizeUniqueConstraintError") {
								throw e;
							}
						}
					}
				},
				makeKey: function (): string {
					// ※ @types の1.0.8現在、何故か引数が逆になっているのでanyで回避
					const r: any = random;
					return r.string(16, "abcdefghijklmnopqrstuvwxyz0123456789");
				},
			},
		}
	);
	return PersonMap;
};
