/**
 * ユーザーコントローラのNode.jsモジュール。
 *
 * あの人は今？の一般ユーザーのRESTアクセスに対応する。
 * @module ./routes/api/users
 */
/**
 * @swagger
 * tag:
 *   name: users
 *   description: ユーザー関連API
 *
 * parameter:
 *   userIdPathParam:
 *     in: path
 *     name: id
 *     description: ユーザーID
 *     required: true
 *     type: integer
 *     format: int32
 */
import * as express from 'express';
import * as passport from 'passport';
import passportHelper from '../../libs/passport-helper';
import validationUtils from '../../libs/validation-utils';
import objectUtils from '../../libs/object-utils';
import { global } from '../../models';
const User = global.User;
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
 *                 $ref: '#/definitions/User'
 *             count:
 *               type: integer
 *               format: int32
 *               description: 総件数
 */
router.get('/', passportHelper.adminAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		const offset = validationUtils.toNumber(req.query['offset'] || 0);
		const limit = validationUtils.toNumber(req.query['limit'] || 50);
		const count = await User.count();
		const users = await User.findAll({ offset: offset, limit: limit });
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
 *           $ref: '#/definitions/User'
 */
router.get('/:id', passportHelper.adminAuthorize(), function (req: express.Request, res: express.Response, next: express.NextFunction) {
	User.findById(validationUtils.toNumber(req.params['id']))
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
 *           $ref: '#/definitions/User'
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 */
router.put('/:id', passportHelper.adminAuthorize(), async function (req: express.Request, res: express.Response, next: express.NextFunction) {
	try {
		let user = await User.findById(validationUtils.toNumber(req.params['id']));
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
 *           $ref: '#/definitions/User'
 *       400:
 *         $ref: '#/responses/BadRequest'
 *       401:
 *         $ref: '#/responses/Unauthorized'
 *       404:
 *         $ref: '#/responses/NotFound'
 */
router.delete('/:id', passportHelper.adminAuthorize(), function (req: express.Request, res: express.Response, next: express.NextFunction) {
	User.findById(validationUtils.toNumber(req.params['id']))
		.then(validationUtils.notFound)
		.then((user) => user.destroy())
		.then(res.json.bind(res))
		.catch(next);
});

module.exports = router;
