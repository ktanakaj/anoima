/**
 * ユーザー関連サービスモジュール。
 * @module ./app/shared/user.service
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ResponseError } from '../core/response-error';
import { Cache } from '../core/cache';
import { User } from './user';

/**
 * ユーザー関連サービスクラス。
 */
@Injectable()
export class UserService {
	/** キャッシュ */
	private cache = new Cache();

	/**
	 * モジュールをDIしてコンポーネントを生成する。
	 * @param http HTTPモジュール。
	 */
	constructor(private http: Http) { }

	/**
	 * 自分の認証情報を取得する。
	 * @returns 自分の情報。未認証時はnull。
	 * @throws HTTPエラーの場合。※キャッシュ有
	 */
	auth(): Promise<User> {
		return this.cache.doAsyncFunc(this.authImpl, this);
	}

	/**
	 * 自分の認証情報を取得する。
	 * @returns 自分の情報。未認証時はnull。
	 * @throws HTTPエラーの場合。
	 */
	authImpl(): Promise<User> {
		return this.http.get('/api/users/me')
			.toPromise()
			.then((res) => res.json())
			.catch((res) => {
				// 401の場合、未認証の正常終了
				if (res.status !== 401) {
					ResponseError.throwError(res);
				}
				return null;
			});
	}

	/**
	 * ログアウトする。
	 * @throws HTTPエラーの場合。
	 */
	logout(): Promise<any> {
		this.cache.reset();
		return this.http.post('/api/users/logout', {})
			.toPromise()
			.catch((res) => {
				// ※ 二重に実行されると401になるが、別に害はないので無視する
				if (res.status !== 401) {
					ResponseError.throwError(res);
				}
				return null;
			});
	}

	/**
	 * 開発用ダミー認証でログインする。
	 * @param dummyId ダミーID。
	 * @returns 自分の情報。
	 * @throws HTTPエラーの場合。
	 */
	loginByDummy(dummyId: string): Promise<User> {
		// ※ ダミーなので、認証失敗はエラーのみ
		this.cache.reset();
		return this.http.post('/api/users/auth/dummy', { platformId: dummyId })
			.toPromise()
			.then((res) => res.json())
			.catch(ResponseError.throwError);
	}
}