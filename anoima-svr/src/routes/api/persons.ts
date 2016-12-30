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
 *
 * parameter:
 *   informationIdPathParam:
 *     in: path
 *     name: informationId
 *     description: あの人情報ID
 *     required: true
 *     type: integer
 *     format: int64
 *   commentIdPathParam:
 *     in: path
 *     name: commentId
 *     description: あの人or情報へのコメントID
 *     required: true
 *     type: integer
 *     format: int64
 *
 * definition:
 *   Information:
 *     type: object
 *     required:
 *       - id
 *       - personId
 *       - ownerId
 *       - releationship
 *     properties:
 *       id:
 *         type: integer
 *         format: int64
 *         description: あの人情報ID
 *       personId:
 *         type: integer
 *         format: int32
 *         description: あの人ID
 *       ownerId:
 *         type: integer
 *         format: int32
 *         description: 投稿者ID
 *       releationship:
 *         type: string
 *         description: あの人との関係
 *       text:
 *         type: string
 *         description: 情報本文
 *       data:
 *         type: string
 *         format: binary
 *         description: 画像などのデータ
 *   Comment:
 *     type: object
 *     required:
 *       - id
 *       - personId
 *       - ownerId
 *       - releationship
 *       - text
 *     properties:
 *       id:
 *         type: integer
 *         format: int64
 *         description: あの人or情報へのコメントID
 *       personId:
 *         type: integer
 *         format: int32
 *         description: あの人ID
 *       informationId:
 *         type: integer
 *         format: int64
 *         description: あの人情報ID
 *       ownerId:
 *         type: integer
 *         format: int32
 *         description: 投稿者ID
 *       releationship:
 *         type: string
 *         description: あの人との関係
 *       text:
 *         type: string
 *         description: コメント本文
 *   InformationWithComment:
 *     allOf:
 *       - $ref: '#/definitions/Information'
 *       - properties:
 *           comments:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Comment'
 *   PersonWithInformationAndComments:
 *     allOf:
 *       - $ref: '#/definitions/PersonWithMap'
 *       - properties:
 *           information:
 *             type: array
 *             items:
 *               $ref: '#/definitions/InformationWithComment'
 *           comments:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Comment'
 */
import * as express from 'express';
import passportManager from '../../libs/passport-manager';
import validationUtils from '../../libs/validation-utils';
import objectUtils from '../../libs/object-utils';
import { global, shardable, logics } from '../../models';
const PersonMap = global.PersonMap;
const Bookmark = global.Bookmark;
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
 *       - in: query
 *         name: fields
 *         description: 取得対象。all の場合informationやコメントを含めて取得
 *         type: string
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           $ref: '#/definitions/PersonWithInformationAndComments'
 */
router.get('/:key', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const personMap = await PersonMap.findByKey(req.params['key']);
		validationUtils.notFound(personMap);
		const person = await personMap.getPerson();
		validationUtils.notFound(person);
		// all の場合、あの人に付けられた情報やコメントも全部取る
		if (req.query.fields == "all") {
			person.information = await person.getInformation();
			// informationにつくコメントも全部取れるので、適切な場所に振り分け
			const comments = await person.getComments();
			objectUtils.mergePushArray(person.information, comments, 'id', 'informationId', 'comments');
			person.comments = comments.filter((c) => !c.informationId);
		}
		res.json(person);
	} catch (e) {
		next(e);
	}
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
 *         description: あの人
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

/**
 * @swagger
 * /persons/{key}:
 *   put:
 *     tags:
 *       - persons
 *     summary: あの人更新
 *     description: あの人を更新する。
 *     security:
 *       - UserSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/personKey'
 *       - in: body
 *         name: body
 *         description: あの人
 *         required: true
 *         schema:
 *           type: object
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
 *         description: 更新成功
 *         schema:
 *           $ref: '#/definitions/PersonWithMap'
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       403:
 *         $ref: '#/responses/Forbidden'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.put('/:key', passportManager.authorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const personMap = await PersonMap.findByKey(req.params['key']);
		validationUtils.notFound(personMap);
		let person = await personMap.getPerson();
		validationUtils.notFound(person);
		passportManager.validateUserIdOrAdmin(req, person.ownerId);
		objectUtils.copy(person, req.body, ['name', 'privacy', 'text']);
		person = await person.save();
		res.json(person);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /persons/{key}:
 *   delete:
 *     tags:
 *       - persons
 *     summary: あの人削除
 *     description: あの人を削除する。
 *     security:
 *       - UserSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/personKey'
 *     responses:
 *       200:
 *         description: 削除成功
 *         schema:
 *           $ref: '#/definitions/PersonWithMap'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       403:
 *         $ref: '#/responses/Forbidden'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.delete('/:key', passportManager.authorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const personMap = await PersonMap.findByKey(req.params['key']);
		validationUtils.notFound(personMap);
		const person = await personMap.getPerson();
		validationUtils.notFound(person);
		passportManager.validateUserIdOrAdmin(req, person.ownerId);
		await person.destroy();
		res.json(person);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /persons/{key}/information/{informationId}:
 *   get:
 *     tags:
 *       - persons
 *     summary: あの人情報の取得
 *     description: あの人に関する情報を取得する。
 *     parameters:
 *       - $ref: '#/parameters/personKey'
 *       - $ref: '#/parameters/informationIdPathParam'
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           $ref: '#/definitions/InformationWithComment'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.get('/:key/information/:informationId', async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const personMap = await PersonMap.findByKey(req.params['key']);
		validationUtils.notFound(personMap);
		const info = await shardable[personMap.no].Information.findById(validationUtils.toNumber(req.params['informationId']));
		validationUtils.notFound(info);
		info.comments = await info.getComments();
		res.json(info);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /persons/{key}/information:
 *   post:
 *     tags:
 *       - persons
 *     summary: あの人の情報の新規登録
 *     description: あの人に関する情報を新規登録する。
 *     security:
 *       - UserSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/personKey'
 *       - in: body
 *         name: body
 *         description: あの人情報
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - releationship
 *           properties:
 *             releationship:
 *               type: string
 *               description: あの人との関係
 *             text:
 *               type: string
 *               description: 情報本文
 *             data:
 *               type: string
 *               format: binary
 *               description: 画像などのデータ
 *     responses:
 *       200:
 *         description: 登録成功
 *         schema:
 *           $ref: '#/definitions/Information'
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.post('/:key/information', passportManager.userAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const personMap = await PersonMap.findByKey(req.params['key']);
		validationUtils.notFound(personMap);
		const person = await personMap.getPerson();
		validationUtils.notFound(person);
		const data = req.body;
		data.ownerId = req.user.id;
		const info = await person.createInformation(data);
		res.json(info);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /persons/{key}/information/{informationId}:
 *   delete:
 *     tags:
 *       - persons
 *     summary: あの人の情報の削除
 *     description: あの人に関する情報を削除する。
 *     security:
 *       - UserSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/personKey'
 *       - $ref: '#/parameters/informationIdPathParam'
 *     responses:
 *       200:
 *         description: 削除成功
 *         schema:
 *           $ref: '#/definitions/Information'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       403:
 *         $ref: '#/responses/Forbidden'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.delete('/:key/information/:informationId', passportManager.authorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const personMap = await PersonMap.findByKey(req.params['key']);
		validationUtils.notFound(personMap);
		const info = await shardable[personMap.no].Information.findById(validationUtils.toNumber(req.params['informationId']));
		validationUtils.notFound(info);
		passportManager.validateUserIdOrAdmin(req, info.ownerId);
		await info.destroy();
		res.json(info);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /persons/{key}/comments:
 *   post:
 *     tags:
 *       - persons
 *     summary: あの人のコメントの新規登録
 *     description: あの人に関するコメントを新規登録する。
 *     security:
 *       - UserSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/personKey'
 *       - in: body
 *         name: body
 *         description: あの人へのコメント
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - releationship
 *           properties:
 *             releationship:
 *               type: string
 *               description: あの人との関係
 *             text:
 *               type: string
 *               description: 情報本文
 *     responses:
 *       200:
 *         description: 登録成功
 *         schema:
 *           $ref: '#/definitions/Comment'
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.post('/:key/comments', passportManager.userAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const personMap = await PersonMap.findByKey(req.params['key']);
		validationUtils.notFound(personMap);
		const person = await personMap.getPerson();
		validationUtils.notFound(person);
		const data = req.body;
		data.ownerId = req.user.id;
		const comment = await person.createComment(data, { fields: ['personId', 'ownerId', 'releationship', 'text'] });
		res.json(comment);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /persons/{key}/information/{informationId}/comments:
 *   post:
 *     tags:
 *       - persons
 *     summary: あの人の情報へのコメントの新規登録
 *     description: あの人情報へのコメントを新規登録する。
 *     security:
 *       - UserSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/personKey'
 *       - $ref: '#/parameters/informationIdPathParam'
 *       - in: body
 *         name: body
 *         description: あの人情報へのコメント
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - releationship
 *           properties:
 *             releationship:
 *               type: string
 *               description: あの人との関係
 *             text:
 *               type: string
 *               description: 情報本文
 *     responses:
 *       200:
 *         description: 登録成功
 *         schema:
 *           $ref: '#/definitions/Comment'
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.post('/:key/information/:informationId/comments', passportManager.userAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const personMap = await PersonMap.findByKey(req.params['key']);
		validationUtils.notFound(personMap);
		const info = await shardable[personMap.no].Information.findById(validationUtils.toNumber(req.params['informationId']));
		validationUtils.notFound(info);
		const data = req.body;
		data.personId = personMap.id;
		data.ownerId = req.user.id;
		const comment = await info.createComment(data);
		res.json(comment);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /persons/{key}/comments/{commentId}:
 *   delete:
 *     tags:
 *       - persons
 *     summary: あの人へのコメントの削除
 *     description: あの人へのコメントを削除する。
 *     security:
 *       - UserSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/personKey'
 *       - $ref: '#/parameters/commentIdPathParam'
 *     responses:
 *       200:
 *         description: 削除成功
 *         schema:
 *           $ref: '#/definitions/Comment'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       403:
 *         $ref: '#/responses/Forbidden'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.delete('/:key/comments/:commentId', passportManager.authorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const personMap = await PersonMap.findByKey(req.params['key']);
		validationUtils.notFound(personMap);
		const comment = await shardable[personMap.no].Comment.findById(validationUtils.toNumber(req.params['commentId']));
		validationUtils.notFound(comment);
		passportManager.validateUserIdOrAdmin(req, comment.ownerId);
		await comment.destroy();
		res.json(comment);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /persons/{key}/bookmark:
 *   post:
 *     tags:
 *       - persons
 *     summary: あの人のお気に入り登録
 *     description: あの人をお気に入りに登録する。
 *     security:
 *       - UserSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/personKey'
 *     responses:
 *       200:
 *         description: 登録成功
 *         schema:
 *           $ref: '#/definitions/Bookmark'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.post('/:key/bookmark', passportManager.userAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const personMap = await PersonMap.findByKey(req.params['key']);
		validationUtils.notFound(personMap);
		const person = await personMap.getPerson();
		validationUtils.notFound(person);
		const bookmark = await Bookmark.create({ userId: req.user.id, personId: personMap.id });
		res.json(bookmark);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /persons/{key}/bookmark:
 *   delete:
 *     tags:
 *       - persons
 *     summary: あの人のお気に入り解除
 *     description: あの人をお気に入りから解除する。
 *     security:
 *       - UserSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/personKey'
 *     responses:
 *       200:
 *         description: 解除成功
 *         schema:
 *           $ref: '#/definitions/Bookmark'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.delete('/:key/bookmark', passportManager.userAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const personMap = await PersonMap.findByKey(req.params['key']);
		validationUtils.notFound(personMap);
		const bookmark = await Bookmark.findOne({ where: { userId: req.user.id, personId: personMap.id } });
		validationUtils.notFound(bookmark);
		await bookmark.destroy();
		res.json(bookmark);
	} catch (e) {
		next(e);
	}
});

module.exports = router;
