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
import validationUtils from '../../libs/validation-utils';
import numberUtils from '../../libs/number-utils';
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
 *       - AuthToken: []
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/PersonWithMap'
 */
router.get('/', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	// TODO: n+1問題解消
	// TODO: ページング
	// TODO: ビジネスロジックに移動
	try {
		const personMaps = await PersonMap.findAll();
		const people = [];
		for (let personMap of personMaps) {
			let person = await personMap.getPerson();
			// TODO: PersonInstanceのプロパティについて調べる
			person['map'] = personMap;
		}
		res.json(people);
	} catch (e) {
		next(e);
	}
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
		.then(res.json.bind(res))
		.catch(next);
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
 *       - in: query
 *         name: limit
 *         description: 取得件数
 *         type: number
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
	logics.randomPeople(validationUtils.range(req.query['limit'], 0, 100))
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
 *       - AuthToken: []
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
router.post('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
	res.end();
});

module.exports = router;
