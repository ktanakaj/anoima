/**
 * システム設定コントローラのNode.jsモジュール。
 *
 * あの人は今？のシステム設定のRESTアクセスに対応する。
 * @module ./routes/api/env
 */
/**
 * @swagger
 * tag:
 *   name: env
 *   description: システム設定API
 */
import * as express from 'express';
import * as config from 'config';
const packagejson = require('../../../package.json');
const router = express.Router();

/**
 * @swagger
 * /env:
 *   get:
 *     tags:
 *       - env
 *     summary: 設定値一覧
 *     description: アプリの設定値の一覧を取得する。
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           type: object
 *           properties:
 *             environment:
 *               type: string
 *               description: NODE_ENV
 *             appName:
 *               type: object
 *               properties:
 *                 ja:
 *                   type: string
 *                   description: 日本語名
 *             version:
 *               type: string
 *               description: サーバーバージョン
 */
router.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
	// API利用側でも参照したい設定情報を返す
	res.json({
		environment: process.env.NODE_ENV,
		appName: config['appName'],
		version: packagejson['version'],
	});
});

module.exports = router;
