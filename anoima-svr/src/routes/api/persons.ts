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
const router = express.Router();

/**
 * @swagger
 * /blocks:
 *   get:
 *     tags:
 *       - blocks
 *     summary: ブロック一覧
 *     description: ブロックの一覧を取得する。
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Block'
 */
router.get('/', function (req: express.Request, res: express.Response, next: Function) {
	res.json({});
});

module.exports = router;
