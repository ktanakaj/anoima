/**
 * @file あの人は今？サーバ側共通定義部。
 */
import * as express from 'express';
import * as path from 'path';
import * as config from 'config';
import * as log4js from 'log4js';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import 'source-map-support/register';
import fileUtils from './libs/file-utils';

const app = express();

// 各種ライブラリ登録
log4js.configure(config['log4js']);
app.use(log4js.connectLogger(log4js.getLogger('access'), {
	level: log4js.levels.INFO,
	nolog: config['noaccesslog'],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');

// リバースプロキシのX-Forwarded-Protoを信じる
app.set('trust proxy', 'loopback');

// クロスドメインでの参照を許可
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Passportの初期化とJson Web Token認証登録
import * as passport from 'passport';
//import passportHelper from './libs/passport-helper';
//app.use(passport.initialize());
//passportHelper.initForJwt(passport);

// ルーティング設定。routesフォルダの全ファイルをapp.use()可能な形式として読み込み
const baseDir = path.join(__dirname, "routes");
let routes = [];
fileUtils.directoryWalkRecursiveSync(
	baseDir,
	function (realpath) {
		if (/\.js$/.test(realpath)) {
			routes.push(realpath);
			app.use(path.join("/", realpath.replace(baseDir, "").replace(/\.js$/, "")), require(realpath));
		}
	});

// API検証用のswagger設定
import swaggerJSDoc = require('swagger-jsdoc');
if (app.get('env') === 'development') {
	const swaggerSpec = swaggerJSDoc({
		swaggerDefinition: config['swagger'],
		apis: routes,
	});

	app.get('/api-docs.json', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		res.send(swaggerSpec);
	});
}

// エラーハンドラー登録
import errorHandlers from './libs/error-handlers';
for (let handler in errorHandlers) {
	app.use(errorHandlers[handler]);
}

module.exports = app;
