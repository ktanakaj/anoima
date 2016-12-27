/**
 * シャーディングなDBモデルパッケージのNode.jsモジュール。
 * @module ./models/shardable
 */
import * as path from 'path';
import * as config from 'config';
import * as Sequelize from 'sequelize';
import * as log4js from 'log4js';
import * as Random from 'random-js';
import * as S from 'string';
import fileUtils from '../../libs/file-utils';
import * as t from '../types';
const random = new Random();
const logger = log4js.getLogger('debug');
const dbconfigs: Array<Object> = config['sequelize']['shardable'];

// 水平分割された複数DBへの接続を作成する
let db: { sequelize: Sequelize.Sequelize, Person?: t.PersonModel, Information?: t.InformationModel, Comment?: t.CommentModel, Vote?: t.VoteModel }[] = [];
for (let i = 0; i < dbconfigs.length; i++) {
	let dbconfig = dbconfigs[i];
	let options = dbconfig['options'] || {};
	// DB番号もログ出力する
	options['logging'] = options['logging'] || ((log) => logger.debug(`#${i}: ${log}`));

	let sequelize = new Sequelize(
		dbconfig['database'],
		dbconfig['username'],
		dbconfig['password'],
		options);

	// このディレクトリにある他のモデルクラスをすべて読み込む
	let m = { sequelize: sequelize };
	fileUtils.directoryWalkSync(
		__dirname,
		(realpath) => {
			const fname = path.basename(realpath);
			if (/\.js$/.test(fname) && fname != "index.js") {
				m[S(path.basename(fname, '.js')).camelize().titleCase().s] = sequelize.import(realpath);
			}
		});

	// ※ 関連は両モデル読み込み後にしか定義できないが、現状それを記述するのによい場所がないためここに記述する
	m['Person'].hasMany(m['Information']);
	m['Information'].belongsTo(m['Person']);
	m['Person'].hasMany(m['Comment']);
	m['Comment'].belongsTo(m['Person']);
	m['Information'].hasMany(m['Comment'], { constraints: false });
	m['Comment'].belongsTo(m['Information'], { constraints: false });
	m['Information'].hasMany(m['Vote']);
	m['Vote'].belongsTo(m['Information']);

	// DBにテーブル定義が存在しない場合は自動的に作成する
	sequelize.sync();

	db.push(m);
}

export default db;

/**
 * DBをランダムに抽選する。
 * @returns 抽選したDB番号。
 */
export function randomDb(): number {
	return random.integer(0, db.length - 1);
}
