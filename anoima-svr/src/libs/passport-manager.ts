/**
 * Passport認証を管理する共通処理モジュール。
 * @module ./libs/passport-manager
 */
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import * as passportFacebook from 'passport-facebook';
import * as express from 'express';
import * as config from 'config';
import * as log4js from 'log4js';
import { HttpError } from './http-error';
import { global, shardable, types } from '../models';
const Administrator = global.Administrator;
const User = global.User;
const logger = log4js.getLogger('debug');

/**
 * Passportの初期化を行う。
 * @param app Expressインスタンス。
 */
function initialize(app: express.Express): void {
	// パスポートの初期化を実行
	app.use(passport.initialize());
	app.use(passport.session());

	// 管理者認証設定
	passport.use(new passportLocal.Strategy(
		{
			usernameField: 'mailAddress',
		},
		async function (mailAddress, password, done) {
			let admin;
			try {
				admin = await Administrator.scope('login').findOne({ where: { mailAddress: mailAddress } });
			} catch (e) {
				return done(e);
			}
			if (!admin) {
				return done(null, false, { message: 'Incorrect mailAddress.' });
			}
			if (!admin.comparePassword(password)) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, admin);
		}
	));

	// 一般ユーザー（Facebook）認証設定
	// ※ アプリ仕様的に匿名垢は危険性が高いので一般ユーザーのローカル認証はやらない
	passport.use(new passportFacebook.Strategy(
		config['passport']['facebook'],
		async function (accessToken, refreshToken, profile, done) {
			// Facebook認証が成功した場合、その情報をDBに格納する
			// ※ リフレッシュトークンはnullの場合がある模様
			logger.debug(`Facebook callbacked: id=${profile.id}, accessToken=${accessToken}, refreshToken=${refreshToken}`);
			try {
				const user = await User.createOrUpdateUser('facebook', profile.id, accessToken, refreshToken);
				return done(null, user);
			} catch (e) {
				return done(e);
			}
		}
	));

	// 認証成功時のシリアライズ
	passport.serializeUser((user, done) => {
		// AdministratorとUserの2種類が渡される。roleの有無で判別
		done(null, { id: user['id'], role: user['role'], type: user['role'] !== undefined ? 'admin' : 'user' });
	});

	// 認証中のユーザー情報デシリアライズ
	passport.deserializeUser((user, done) => {
		// デシリアライズはそのまま復元するだけ
		done(null, user);
	});
}

/**
 * ユーザーor管理者の権限チェック。
 *
 * 作者または管理者のみOKのようなAPI用。
 * @returns チェック関数。
 */
function authorize(): express.RequestHandler {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		let error = null;
		if (!req.isAuthenticated()) {
			error = new HttpError(401);
		}
		return next(error);
	};
}

/**
 * 管理者の権限チェック。
 * @param status 'super'などユーザーの権限。未指定は何でも可。
 * @returns チェック関数。
 */
function adminAuthorize(role?: string): express.RequestHandler {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		let error = null;
		// 一般ユーザーはNG
		if (!req.isAuthenticated() || !req.user || req.user['type'] === 'user') {
			error = new HttpError(401);
		} else if ((role && req.user['role'] !== role)) {
			error = new HttpError(403);
		}
		return next(error);
	};
}

/**
 * 一般ユーザーの認証チェック。
 * @returns チェック関数。
 */
function userAuthorize(): express.RequestHandler {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		let error = null;
		// 管理者はNG
		if (!req.isAuthenticated() || !req.user || req.user['type'] === 'admin') {
			error = new HttpError(401);
		}
		return next(error);
	};
}

/**
 * 渡されたユーザーIDをHTTPリクエスト内の認証ユーザーから検証する。
 * ※ 管理者は不一致でもOK
 * @param req HTTPリクエスト。
 * @param id 比較するユーザーID。
 * @throws 検証NG。
 */
function validateUserIdOrAdmin(req: express.Request, id: number) {
	if (!req.isAuthenticated() || !req.user || (req.user.id != id && req.user['type'] != "admin")) {
		throw new HttpError(403);
	}
}

export default {
	initialize: initialize,
	authorize: authorize,
	adminAuthorize: adminAuthorize,
	userAuthorize: userAuthorize,
	validateUserIdOrAdmin: validateUserIdOrAdmin,
};