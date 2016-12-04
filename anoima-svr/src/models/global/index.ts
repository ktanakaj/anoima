/**
 * 非シャーディングなDBモデルパッケージのNode.jsモジュール。
 * @module ./models/global
 */
import * as path from 'path';
import * as config from 'config';
import * as Sequelize from 'sequelize';
import * as log4js from 'log4js';
import fileUtils from '../../libs/file-utils';
import stringUtils from '../../libs/string-utils';
const logger = log4js.getLogger('debug');
const dbconfig = config['sequelize']['global'];

let options = dbconfig['options'] || {};
options['logging'] = options['logging'] || ((log) => logger.debug(log));

let sequelize = new Sequelize(
	dbconfig['database'],
	dbconfig['username'],
	dbconfig['password'],
	options);

// このディレクトリにある他のモデルクラスをすべて読み込む
let models = { sequelize: sequelize };
fileUtils.directoryWalkSync(
	__dirname,
	(realpath) => {
		const fname = path.basename(realpath);
		if (/\.js$/.test(fname) && fname != "index.js") {
			models[stringUtils.ucfirst(stringUtils.camelize(path.basename(fname, '.js')))]
				= sequelize.import(realpath);
		}
	});

// ※ 関連は両モデル読み込み後にしか定義できないが、現状それを記述するのによい場所がないためここに記述する
models['PersonMap'].hasMany(models['Bookmark'], { as: 'personMap', foreignKey: 'personId' });
models['User'].hasMany(models['Bookmark']);
models['Bookmark'].belongsTo(models['PersonMap'], { as: 'personMap', foreignKey: 'personId' });
models['Bookmark'].belongsTo(models['User']);

// DBにテーブル定義が存在しない場合は自動的に作成する
sequelize.sync();

export default models;
