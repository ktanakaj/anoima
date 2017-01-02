/**
 * 管理者コントローラのNode.jsモジュール。
 *
 * あの人は今？の管理者のRESTアクセスに対応する。
 * @module ./routes/api/administrators
 */
/**
 * @swagger
 * tag:
 *   name: administrators
 *   description: 管理者関連API
 *
 * parameter:
 *   administratorIdPathParam:
 *     in: path
 *     name: id
 *     description: 管理者ID
 *     required: true
 *     type: integer
 *     format: int32
 *
 * definition:
 *   Administrator:
 *     type: object
 *     required:
 *       - id
 *       - mailAddress
 *     properties:
 *       id:
 *         type: integer
 *         format: int32
 *         description: 管理者ID
 *       mailAddress:
 *         type: string
 *         description: 管理者メールアドレス
 *       role:
 *         type: string
 *         description: 権限
 *       createdAt:
 *         type: string
 *         format: date-time
 *         description: 登録日時
 *       updatedAt:
 *         type: string
 *         format: date-time
 *         description: 更新日時
 */
import * as express from 'express';
import * as passport from 'passport';
import passportManager from '../../libs/passport-manager';
import validationUtils from '../../libs/validation-utils';
import objectUtils from '../../libs/object-utils';
import { global } from '../../models';
const Administrator = global.Administrator;
const router = express.Router();

/**
 * @swagger
 * /administrators:
 *   get:
 *     tags:
 *       - administrators
 *     summary: 管理者一覧
 *     description: 管理者の一覧を取得する。
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
 *             administrators:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Administrator'
 *             count:
 *               type: integer
 *               format: int32
 *               description: 総件数
 */
router.get('/', passportManager.adminAuthorize('super'), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const offset = validationUtils.toNumber(req.query['offset'] || 0);
		const limit = validationUtils.toNumber(req.query['limit'] || 50);
		const count = await Administrator.count();
		const administrators = await Administrator.findAll({ offset: offset, limit: limit });
		res.json({
			administrators: administrators,
			count: count,
		});
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /administrators/{id}:
 *   get:
 *     tags:
 *       - administrators
 *     summary: 管理者取得
 *     description: 管理者を取得する。
 *     security:
 *       - AdminSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/administratorIdPathParam'
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           $ref: '#/definitions/Administrator'
 */
router.get('/:id', passportManager.adminAuthorize('super'), function (req: express.Request, res: express.Response, next: express.NextFunction) {
	Administrator.findById(validationUtils.toNumber(req.params['id']))
		.then(validationUtils.notFound)
		.then(res.json.bind(res))
		.catch(next);
});

/**
 * @swagger
 * /administrators:
 *   post:
 *     tags:
 *       - administrators
 *     summary: 管理者新規登録
 *     description: 管理者を新規登録する。
 *     security:
 *       - AdminSessionId: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: 管理者情報
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - mailAddress
 *             - password
 *           properties:
 *             mailAddress:
 *               type: string
 *               description: 管理者メールアドレス
 *             password:
 *               type: string
 *               format: password
 *               description: 管理者パスワード
 *             role:
 *               type: string
 *               description: 権限
 *     responses:
 *       200:
 *         description: 登録成功
 *         schema:
 *           $ref: '#/definitions/Administrator'
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       403:
 *         $ref: '#/responses/Forbidden'
 */
router.post('/', passportManager.adminAuthorize('super'), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const admin = await Administrator.create(req.body);
		// パスワードは返さない（deleteで何故か消せないのでnullで上書き）
		admin.password = null;
		res.json(admin);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /administrators/{id}:
 *   delete:
 *     tags:
 *       - administrators
 *     summary: 管理者削除
 *     description: 管理者を削除する。
 *     security:
 *       - AdminSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/administratorIdPathParam'
 *     responses:
 *       200:
 *         description: 削除成功
 *         schema:
 *           $ref: '#/definitions/Administrator'
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.delete('/:id', passportManager.adminAuthorize('super'), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const admin = await Administrator.findById(validationUtils.toNumber(req.params['id']));
		validationUtils.notFound(admin);
		await admin.destroy();
		res.json(admin);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /administrators/me:
 *   put:
 *     tags:
 *       - administrators
 *     summary: 管理者情報更新
 *     description: 自分の情報を更新する。
 *     security:
 *       - AdminSessionId: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: 管理者情報
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             mailAddress:
 *               type: string
 *               description: 管理者メールアドレス
 *             password:
 *               type: string
 *               format: password
 *               description: 管理者パスワード
 *     responses:
 *       200:
 *         description: 更新成功
 *         schema:
 *           $ref: '#/definitions/Administrator'
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 */
router.put('/me', passportManager.adminAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		let admin = await Administrator.findById(req.user.id);
		validationUtils.notFound(admin);
		objectUtils.copy(admin, req.body, ['mailAddress', 'password']);
		admin = await admin.save();
		// パスワードは返さない（deleteで何故か消せないのでnullで上書き）
		admin.password = null;
		res.json(admin);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /administrators/login:
 *   post:
 *     tags:
 *       - administrators
 *     summary: 管理者認証
 *     description: メールアドレスとパスワードで認証を行う。
 *     parameters:
 *       - in: body
 *         name: body
 *         description: 管理者情報
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - mailAddress
 *             - password
 *           properties:
 *             mailAddress:
 *               type: string
 *               description: 管理者メールアドレス
 *             password:
 *               type: string
 *               format: password
 *               description: 管理者パスワード
 *     responses:
 *       200:
 *         description: 認証OK
 *         schema:
 *           $ref: '#/definitions/Administrator'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 */
router.post('/login', passport.authenticate('local'), function (req: express.Request, res: express.Response, next: express.NextFunction) {
	// パスワードは返さない（deleteで何故か消せないのでnullで上書き）
	req.user.password = null;
	res.json(req.user);
});

/**
 * @swagger
 * /administrators/logout:
 *   post:
 *     tags:
 *       - administrators
 *     summary: ログアウト
 *     description: ログアウトする。
 *     security:
 *       - AdminSessionId: []
 *     responses:
 *       200:
 *         description: ログアウト成功
 *       401:
 *         $ref: '#/responses/Unauthorized'
 */
router.post('/logout', passportManager.adminAuthorize(), function (req: express.Request, res: express.Response, next: express.NextFunction) {
	req.logout();
	res.end();
});

module.exports = router;
