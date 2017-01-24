/**
 * システム設定関連サービスモジュール。
 * @module ./app/shared/env.service
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ResponseError } from '../core/response-error';
import { Cache } from '../core/cache';

export interface EnvResult {
	environment?: string;
	appName?: Object;
	version?: string;
}

/**
 * システム設定関連サービスクラス。
 */
@Injectable()
export class EnvService {
	/** キャッシュ */
	private cache = new Cache();

	/**
	 * モジュールをDIしてコンポーネントを生成する。
	 * @param http HTTPモジュール。
	 */
	constructor(private http: Http) { }

	/**
	 * システム設定情報を取得する。
	 * @returns システム設定情報。
	 * @throws HTTPエラーの場合。※キャッシュ有
	 */
	env(): Promise<EnvResult> {
		return this.cache.doAsyncFunc(this.envImpl, this);
	}

	/**
	 * システム設定情報を取得する。
	 * @returns システム設定情報。
	 * @throws HTTPエラーの場合。
	 */
	private envImpl(): Promise<EnvResult> {
		return this.http.get('/api/env')
			.toPromise()
			.then((res) => res.json())
			.catch(ResponseError.throwError);
	}
}