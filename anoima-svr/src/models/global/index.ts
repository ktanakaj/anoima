/**
 * 非シャーディングなDBモデルパッケージのNode.jsモジュール。
 * @module ./models/global
 */
import * as path from 'path';
import * as config from 'config';
import * as Sequelize from 'sequelize';
import * as log4js from 'log4js';
import * as S from 'string';
import fileUtils from '../../libs/file-utils';
import * as t from '../types';
const logger = log4js.getLogger('debug');
const dbconfig = config['sequelize']['global'];

const options = dbconfig['options'] || {};
options['logging'] = options['logging'] || ((log) => logger.debug(log));

const sequelize = new Sequelize(
	dbconfig['database'],
	dbconfig['username'],
	dbconfig['password'],
	options);

// このディレクトリにある他のモデルクラスをすべて読み込む
const m: { sequelize: Sequelize.Sequelize, PersonMap?: t.PersonMapModel, User?: t.UserModel, Bookmark?: t.BookmarkModel, Administrator?: t.AdministratorModel } = { sequelize };
fileUtils.directoryWalkSync(
	__dirname,
	(realpath) => {
		const fname = path.basename(realpath);
		if (/\.js$/.test(fname) && fname != "index.js") {
			m[S(path.basename(fname, '.js')).camelize().titleCase().s] = sequelize.import(realpath);
		}
	});

// ※ 関連は両モデル読み込み後にしか定義できないが、現状それを記述するのによい場所がないためここに記述する
m.PersonMap.hasMany(m.Bookmark, { as: 'personMap', foreignKey: 'personId' });
m.User.hasMany(m.Bookmark);
m.Bookmark.belongsTo(m.PersonMap, { as: 'personMap', foreignKey: 'personId' });
m.Bookmark.belongsTo(m.User);

// DBにテーブル定義が存在しない場合は自動的に作成する
sequelize.sync();

export default m;