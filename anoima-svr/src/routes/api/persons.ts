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
import models from '../../models';
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
router.get('/', function (req: express.Request, res: express.Response, next: Function) {
	// ※ 意味のあるデータにするにはシェーディングされたテーブルまで見る必要がある
	//    現状だとテスト用
	models.global['PersonMap'].findAll()
		.then(res.json.bind(res))
		.catch(next);
});

module.exports = router;
