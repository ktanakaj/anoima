/**
 * あの人コントローラのNode.jsモジュール。
 *
 * あの人は今？のあの人のRESTアクセスに対応する。
 * @module ./routes/api/persons
 */
/**
 * @swagger
 * tag:
 *   name: persons
 *   description: あの人関連API
 */
import * as express from 'express';
import validator from '../../libs/validator';
import { global } from '../../models';
const PersonMap = global.PersonMap;
const router = express.Router();

/**
 * @swagger
 * /persons:
 *   get:
 *     tags:
 *       - persons
 *     summary: あの人ID一覧
 *     description: あの人IDの一覧を取得する。
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 format: int32
 *                 description: あの人ID
 *               key:
 *                 type: string
 *                 description: あの人キー
 *               no:
 *                 type: integer
 *                 format: int32
 *                 description: DB番号
 */
router.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
	// ※ 意味のあるデータにするにはシェーディングされたテーブルまで見る必要がある
	//    現状だとテスト用
	PersonMap.findAll()
		.then(res.json.bind(res))
		.catch(next);
});

/**
 * @swagger
 * /persons/{key}:
 *   get:
 *     tags:
 *       - persons
 *     summary: あの人取得
 *     description: あの人を取得する。
 *     parameters:
 *       - $ref: '#/parameters/personKey'
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 format: int32
 *                 description: あの人ID
 *               key:
 *                 type: string
 *                 description: あの人キー
 *               no:
 *                 type: integer
 *                 format: int32
 *                 description: DB番号
 */
router.get('/:key', function (req: express.Request, res: express.Response, next: express.NextFunction) {
	PersonMap.findByKey(req.params['key'])
		.then(validator.validateNotFound)
		.then((personMap) => personMap.getPerson())
		.then(res.json.bind(res))
		.catch(next);
});

module.exports = router;
