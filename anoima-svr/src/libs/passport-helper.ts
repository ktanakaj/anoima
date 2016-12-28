/**
 * Passport関連の共通処理モジュール。
 * @module ./libs/passport-helper
 */
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import * as passportFacebook from 'passport-facebook';
import * as express from 'express';
import * as config from 'config';
import * as log4js from 'log4js';
import { HttpError } from './http-error';
import { global, shardable } from '../models';
const Administrator = global.Administrator;
const User = global.User;
const logger = log4js.getLogger('debug');

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
		// 管理者か一般ユーザーかはロールの有無で判定
		if (!req.isAuthenticated() || !req.user || !req.user.role) {
			error = new HttpError(401);
		} else if ((role && req.user.role !== role)) {
			error = new HttpError(403);
		}
		return next(error);
	};
}

/**
 * Passportへの一般ユーザー用認証設定。
 * @param passport パスポートインスタンス。
 */
function initUserAuth(passport: passport.Passport): void {
	passport.use(new passportFacebook.Strategy(
		config['passport']['facebook'],
		async function (accessToken, refreshToken, profile, done) {
			// Facebook認証が成功した場合、その情報をDBに格納する
			// ※ リフレッシュトークンはnullの場合がある模様
			logger.debug(`Facebook callbacked: id=${profile.id}, accessToken=${accessToken}, refreshToken=${refreshToken}`);
			try {
				const options = {
					where: { platform: 'facebook', platformId: profile.id },
					paranoid: true,
				};
				const result = await User.findOrInitialize(options);
				let user = result[0];
				if (user.deletedAt) {
					// 削除ユーザー=BANなので再登録不可
					return done(new HttpError(403));
				}
				user.platform = 'facebook';
				user.platformId = profile.id;
				user.accessToken = accessToken;
				user.refreshToken = refreshToken;
				user = await user.save();
				return done(null, user);
			} catch (e) {
				return done(e);
			}
		}
	));

	passport.serializeUser((user, done) => {
		done(null, { id: user.id });
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});
}

/**
 * 一般ユーザーの認証チェック。
 * @returns チェック関数。
 */
function userAuthorize(): express.RequestHandler {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		let error = null;
		// 管理者はNG
		if (!req.isAuthenticated() || !req.user || req.user.role) {
			error = new HttpError(401);
		}
		return next(error);
	};
}

export default {
	initAdminAuth: initAdminAuth,
	adminAuthorize: adminAuthorize,
	initUserAuth: initUserAuth,
	userAuthorize: userAuthorize,
};