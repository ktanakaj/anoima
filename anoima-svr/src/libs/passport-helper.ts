/**
 * Passport関連の共通処理モジュール。
 * @module ./libs/passport-helper
 */
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import * as express from 'express';
import * as config from 'config';
import { HttpError } from './http-error';
import { global, shardable } from '../models';
const Administrator = global.Administrator;

/**
 * Passportへの管理者用認証設定。
 * @param passport パスポートインスタンス。
 */
function initAdminAuth(passport: passport.Passport): void {
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

	passport.serializeUser((admin, done) => {
		done(null, { id: admin.id, role: admin.role });
	});

	passport.deserializeUser((admin, done) => {
		done(null, admin);
	});
}

/**
 * 管理者の権限チェック。
 * @param status 'super'などユーザーの権限。未指定は何でも可。
 * @returns チェック関数。
 */
function adminAuthorize(role?: string): express.RequestHandler {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		let error = null;
		if (!req.isAuthenticated()) {
			error = new HttpError(401);
		} else if (!req.user || (role && req.user.role !== role)) {
			error = new HttpError(403);
		}
		return next(error);
	};
}

export default {
	initAdminAuth: initAdminAuth,
	adminAuthorize: adminAuthorize,
};