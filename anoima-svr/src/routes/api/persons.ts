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
import passportManager from '../../libs/passport-manager';
import validationUtils from '../../libs/validation-utils';
import { global, shardable, logics } from '../../models';
const PersonMap = global.PersonMap;
const router = express.Router();

/**
 * @swagger
 * /persons:
 *   get:
 *     tags:
 *       - persons
 *     summary: あの人一覧
 *     description: あの人の一覧を取得する（管理画面用）。
 *     security:
 *       - AdminSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/offset'
 *       - $ref: '#/parameters/limit'
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           type: object
 *           properties:
 *             people:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/PersonWithMap'
 *             count:
 *               type: integer
 *               format: int32
 *               description: 総件数
 */
router.get('/', passportManager.adminAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const offset = validationUtils.toNumber(req.query['offset'] || 0);
		const limit = validationUtils.toNumber(req.query['limit'] || 50);
		const count = await PersonMap.count();
		const people = await PersonMap.findAllWithPerson({ offset: offset, limit: limit });
		res.json({
			people: people,
			count: count,
		});
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /persons/random:
 *   get:
 *     tags:
 *       - persons
 *     summary: あの人ランダムx人取得
 *     description: あの人をランダムでx人を取得する。
 *     parameters:
 *       - $ref: '#/parameters/limit'
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/PersonWithMap'
 *       400:
 *         $ref: '#/responses/BadRequest'
 */
router.get('/random', function (req: express.Request, res: express.Response, next: express.NextFunction) {
	logics.randomPeople(validationUtils.range(req.query['limit'] || 20, 0, 100))
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
 *           $ref: '#/definitions/Person'
 */
router.get('/:key', function (req: express.Request, res: express.Response, next: express.NextFunction) {
	PersonMap.findByKey(req.params['key'])
		.then(validationUtils.notFound)
		.then((personMap) => personMap.getPerson())
		.then(validationUtils.notFound)
		.then(res.json.bind(res))
		.catch(next);
});

/**
 * @swagger
 * /persons:
 *   post:
 *     tags:
 *       - persons
 *     summary: あの人新規登録
 *     description: あの人を新規登録する。
 *     security:
 *       - UserSessionId: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: あの人情報
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - privacy
 *           properties:
 *             name:
 *               type: string
 *               description: あの人の名前
 *             privacy:
 *               type: string
 *               description: 公開設定
 *             text:
 *               type: string
 *               description: あの人の説明
 *     responses:
 *       200:
 *         description: 登録成功
 *         schema:
 *           $ref: '#/definitions/PersonWithMap'
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 */
router.post('/', passportManager.userAuthorize(), function (req: express.Request, res: express.Response, next: express.NextFunction) {
	const data = req.body;
	data.ownerId = req.user.id;
	logics.createPerson(data)
		.then(res.json.bind(res))
		.catch(next);
});

module.exports = router;
