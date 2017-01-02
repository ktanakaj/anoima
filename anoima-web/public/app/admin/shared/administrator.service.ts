/**
 * 管理者関連サービスモジュール。
 * @module ./app/admin/shared/administrator.service
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ResponseError } from '../../shared/response-error';
import { Administrator } from './administrator';

/**
 * 管理者関連サービスクラス。
 */
@Injectable()
export class AdministratorService {
	/**
	 * モジュールをDIしてコンポーネントを生成する。
	 * @param http HTTPモジュール。
	 */
	constructor(private http: Http) { }
}