/**
 * あの人関連サービスモジュール。
 * @module ./app/shared/person.service
 */
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { ResponseError } from './response-error';
import { Person } from './person';

/** 通信失敗時のリトライ回数。 */
const MAX_RETRY = 3;

/**
 * あの人関連サービスクラス。
 */
@Injectable()
export class PersonService {
	/**
	 * モジュールをDIしてコンポーネントを生成する。
	 * @param http HTTPモジュール。
	 */
	constructor(private http: Http) { }

	/**
	 * あの人をキーから取得する。
	 * @param key あの人キー。
	 * @returns あの人。
	 * @throws HTTPエラーの場合。
	 */
	findByKey(key: string): Promise<Person> {
		// ※ 関連情報も一緒に取得
		const params = new URLSearchParams();
		params.set('fields', 'all');
		return this.http.get('/api/persons/' + key, { search: params })
			.retry(MAX_RETRY)
			.toPromise()
			.then((res) => res.json())
			.catch(ResponseError.throwError);
	}

	/**
	 * あの人をランダムでx人を取得する。
	 * @param limit 取得件数。
	 * @returns あの人配列。
	 * @throws HTTPエラーの場合。
	 */
	random(limit: number): Promise<Person[]> {
		return this.http.get('/api/persons/random')
			.retry(MAX_RETRY)
			.toPromise()
			.then((res) => res.json())
			.catch(ResponseError.throwError);
	}
}