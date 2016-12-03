/**
 * Expressのrouterのテスト用モックモジュール。
 * @module ./test/router-mock
 */
import * as express from 'express';
import './init';

/** @const {Array} */
const AUTHORIZED_HEADERS = {
	// userId = 2 の認証トークン
	authorization: "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsInRpbWVzdGFtcCI6MTQ3MzQzMzM5ODg4NX0.5St4FGMG3n99qt8cULXhyhed4AOi5nXZ0lLNkE9OE5E",
};
/** @const {Array} */
const TRACKING_COOKIES = {
	"Tracking-Id": "unittest-games",
};

/**
 *  Expressのrouterにテスト用モックの機能を提供するクラス。
 */
class RouterMock {
	router: express.Router;

	/**
	 * モックインスタンスを生成する。
	 * @param router モックするrouterインスタンス。
	 */
	constructor(router) {
		this.router = router;
	}

	/**
	 * 指定されたパスの処理を実行する。
	 *
	 * ※ パスはキーとしているのみ。構文を解析するわけではない。
	 * @param path 実行するパス。
	 * @param method 実行するメソッド。
	 * @param req HTTPリクエスト。
	 * @param res HTTPレスポンス。
	 * @param next 後続のルーティング処理へのcallback。
	 */
	run(path: string, method: string, req: express.Request, res: express.Response, next?: Function) {
		//TODO: 引数methodも対応する
		let stack = this.router.stack.find((s) => s.route.path == path);
		if (!stack) {
			return undefined;
		}
		return stack.route.stack[0].handle(req, res, next);
	}

	/**
	 * モック用のリクエストインスタンスを生成する。
	 * @param body bodyに設定する値。
	 * @param headers headersに設定する値。未指定時はテスト用のデフォルトが設定される。
	 * @param cookies cookiesに設定する値。未指定時はテスト用のデフォルトが設定される。
	 * @returns 生成したモック。
	 */
	static makeMockRequest(body, headers = AUTHORIZED_HEADERS, cookies = TRACKING_COOKIES) {
		return {
			body: body,
			headers: headers,
			cookies: cookies,
			user: headers === AUTHORIZED_HEADERS ? { id: 2 } : undefined,
			ip: () => "127.0.0.1",
		};
	}
}

module.exports = RouterMock;
