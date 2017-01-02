/**
 * HTTPレスポンスエラー用例外クラス。
 * @module ./app/shared/response-error
 */
import { Response } from '@angular/http';

/**
 * HTTPレスポンスのエラーを格納する例外クラス。
 */
export class ResponseError extends Error {
	/** HTTPステータスコード */
	status: number;

	/**
	 * 例外を生成する。
	 * @param response HTTPレスポンス。
	 */
	constructor(response: Response | any) {
		super(ResponseError.makeErrorMessage(response));
		this.name = "ResponseError";
		this.status = response && response.status ? response.status : 500;
	}

	/**
	 * HTTPレスポンスからエラーメッセージを生成する。
	 * @param response HTTPレスポンス。
	 * @returns 例外エラーメッセージ。
	 */
	static makeErrorMessage(response: Response | any): string {
		let message = "Network Error";
		if (response instanceof Response) {
			if (response.status != -1) {
				message = response.status + " " + response.text();
			}
			if (response.url) {
				message += " (" + response.url + ")";
			}
		}
		return message;
	}

	/**
	 * HTTPレスポンスから例外を投げる。
	 * @param response HTTPレスポンス。
	 * @throws 生成した例外。
	 */
	static throwError(response: Response | any): any {
		// ※ 戻り値はないけど、anyにしておかないとObservableとかでコンパイルエラー
		throw new ResponseError(response);
	}
}