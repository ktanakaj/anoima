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
 */
import * as express from 'express';
import * as passport from 'passport';
import passportHelper from '../../libs/passport-helper';
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
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Administrator'
 */
router.get('/', passportHelper.adminAuthorize('super'), function (req: express.Request, res: express.Response, next: express.NextFunction) {
	Administrator.findAll()
		.then(res.json.bind(res))
		.catch(next);
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
router.get('/:id', passportHelper.adminAuthorize('super'), function (req: express.Request, res: express.Response, next: express.NextFunction) {
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
router.post('/', passportHelper.adminAuthorize('super'), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
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
router.put('/me', passportHelper.adminAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
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
 * /administrators/authenticate:
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
 *               description: 管理者パスワード
 *     responses:
 *       200:
 *         description: 認証OK
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: 認証トークン
 *       401:
 *         $ref: '#/responses/Unauthorized'
 */
router.post('/authenticate', passport.authenticate('local'), function (req: express.Request, res: express.Response, next: express.NextFunction) {
	// パスワードは返さない（deleteで何故か消せないのでnullで上書き）
	req.user.password = null;
	res.json(req.user);
});

module.exports = router;
