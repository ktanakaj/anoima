/**
 * ユーザーコントローラのNode.jsモジュール。
 *
 * あの人は今？の一般ユーザーのRESTアクセスに対応する。
 * @module ./routes/api/users
 */
/**
 * @swagger
 * tags:
 *   name: users
 *   description: ユーザー関連API
 *
 * parameters:
 *   userIdPathParam:
 *     in: path
 *     name: id
 *     description: ユーザーID
 *     required: true
 *     type: integer
 *     format: int32
 *
 * definitions:
 *   UserOnlyPublic:
 *     type: object
 *     required:
 *       - id
 *       - platform
 *     properties:
 *       id:
 *         type: integer
 *         format: int32
 *         description: ユーザーID
 *       platform:
 *         type: string
 *         description: 認証プラットフォーム
 *       createdAt:
 *         type: string
 *         format: date-time
 *         description: 登録日時
 *       updatedAt:
 *         type: string
 *         format: date-time
 *         description: 更新日時
 *
 *   UserWithPrivate:
 *     allOf:
 *       - $ref: '#/definitions/UserOnlyPublic'
 *       - properties:
 *           platformId:
 *             type: string
 *             description: 認証プラットフォームID
 *           note:
 *             type: string
 *             description: ノート
 */
import * as express from 'express';
import * as passport from 'passport';
import passportManager from '../../libs/passport-manager';
import validationUtils from '../../libs/validation-utils';
import objectUtils from '../../libs/object-utils';
import { global } from '../../models';
const User = global.User;
const Bookmark = global.Bookmark;
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - users
 *     summary: ユーザー一覧
 *     description: ユーザーの一覧を取得する。
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
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/UserWithPrivate'
 *             count:
 *               type: integer
 *               format: int32
 *               description: 総件数
 */
router.get('/', passportManager.adminAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const offset = validationUtils.toNumber(req.query['offset'] || 0);
		const limit = validationUtils.toNumber(req.query['limit'] || 50);
		const count = await User.count();
		const users = await User.scope('withPrivate').findAll({ offset: offset, limit: limit });
		res.json({
			users: users,
			count: count,
		});
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags:
 *       - users
 *     summary: ユーザーの自分の情報
 *     description: 自分の情報を取得する。
 *     security:
 *       - UserSessionId: []
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           $ref: '#/definitions/UserOnlyPublic'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 */
router.get('/me', passportManager.userAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	User.findById(req.user.id)
		.then(validationUtils.notFound)
		.then(res.json.bind(res))
		.catch(next);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - users
 *     summary: ユーザー取得
 *     description: ユーザーを取得する。
 *     security:
 *       - AdminSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/userIdPathParam'
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           $ref: '#/definitions/UserWithPrivate'
 */
router.get('/:id', passportManager.adminAuthorize(), function (req: express.Request, res: express.Response, next: express.NextFunction) {
	User.scope('withPrivate').findById(validationUtils.toNumber(req.params['id']))
		.then(validationUtils.notFound)
		.then(res.json.bind(res))
		.catch(next);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - users
 *     summary: ユーザー情報更新
 *     description: ユーザー情報を更新する。
 *     security:
 *       - AdminSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/userIdPathParam'
 *       - in: body
 *         name: body
 *         description: ユーザー情報
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             note:
 *               type: string
 *               description: ノート
 *     responses:
 *       200:
 *         description: 更新成功
 *         schema:
 *           $ref: '#/definitions/UserWithPrivate'
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 */
router.put('/:id', passportManager.adminAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		let user = await User.scope('withPrivate').findById(validationUtils.toNumber(req.params['id']));
		validationUtils.notFound(user);
		objectUtils.copy(user, req.body, ['note']);
		user = await user.save();
		res.json(user);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - users
 *     summary: ユーザー削除
 *     description: ユーザーを削除する。
 *     security:
 *       - AdminSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/userIdPathParam'
 *     responses:
 *       200:
 *         description: 削除成功
 *         schema:
 *           $ref: '#/definitions/UserWithPrivate'
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.delete('/:id', passportManager.adminAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const user = await User.scope('withPrivate').findById(validationUtils.toNumber(req.params['id']));
		validationUtils.notFound(user);
		await user.destroy();
		res.json(user);
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /users/me/bookmarks:
 *   get:
 *     tags:
 *       - users
 *     summary: ユーザーのブックマーク一覧
 *     description: 自分のブックマーク一覧を取得する。
 *     security:
 *       - UserSessionId: []
 *     parameters:
 *       - $ref: '#/parameters/offset'
 *       - $ref: '#/parameters/limit'
 *     responses:
 *       200:
 *         description: 取得成功
 *         schema:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/BookmarkWithPerson'
 *             count:
 *               type: integer
 *               format: int32
 *               description: 総件数
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 */
router.get('/me/bookmarks', passportManager.userAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const offset = validationUtils.toNumber(req.query['offset'] || 0);
		const limit = validationUtils.toNumber(req.query['limit'] || 50);
		const count = await Bookmark.scope({ method: ['byUser', req.user.id] }).count();
		const bookmarks = await Bookmark.findAllByUser(req.user.id, { offset: offset, limit: limit });
		res.json({
			bookmarks: bookmarks,
			count: count,
		});
	} catch (e) {
		next(e);
	}
});

/**
 * @swagger
 * /users/logout:
 *   post:
 *     tags:
 *       - users
 *     summary: ログアウト
 *     description: ログアウトする。
 *     security:
 *       - UserSessionId: []
 *     responses:
 *       200:
 *         description: ログアウト成功
 *       401:
 *         $ref: '#/responses/Unauthorized'
 */
router.post('/logout', passportManager.userAuthorize(), function (req: express.Request, res: express.Response, next: express.NextFunction) {
	req.logout();
	res.end();
});

/**
 * @swagger
 * /users/auth/dummy:
 *   post:
 *     tags:
 *       - users
 *     summary: 開発用ダミーユーザー認証
 *     description: 渡されたIDでログインを行う。
 *     parameters:
 *       - in: body
 *         name: body
 *         description: ユーザー情報
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - platformId
 *           properties:
 *             platformId:
 *               type: string
 *               description: プラットフォームID
 *     responses:
 *       200:
 *         description: 認証OK
 *         schema:
 *           $ref: '#/definitions/UserOnlyPublic'
 *       403:
 *         $ref: '#/responses/Forbidden'
 */
if (process.env.NODE_ENV === 'development') {
	// ※ OAuth認証は本物のアカウントが必要なので、開発時はダミーでログイン可能にする
	router.post('/auth/dummy', function (req: express.Request, res: express.Response, next: express.NextFunction) {
		User.createOrUpdateUser('dummy', req.body['platformId'], '', null)
			.then((user) => {
				req.login(user, (err) => {
					if (err) return next(err);
					res.json(user);
				});

			})
			.catch(next);
	});
}

module.exports = router;
