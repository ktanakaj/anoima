/**
 * バリデーション共通処理モジュール。
 * @module ./libs/validator
 */
import { HttpError } from './http-error';

/**
 * バリデートエラーのメッセージを生成する。
 * @param key キー情報を通知する場合その値。
 * @param value 値情報を通知する場合その値。
 * @param name モデル名を通知する場合その値。
 * @param message エラーの内容。
 * @returns エラーメッセージ。
 */
function makeMessage(key?: string, value?: string, name?: string, suffix?: string): string {
	let message = null;
	if (key && value) {
		message = key + "=" + value + " " + suffix;
		if (name) {
			message = name + "." + suffix;
		}
	}
	return message;
}

/**
 * 渡された値が空か検証する。
 * @param param 空かチェックする値。
 * @param key NG時にキー情報を通知する場合その値。
 * @param value NG時に値情報を通知する場合その値。
 * @param name NG時にモデル名を通知する場合その値。
 * @returns paramの値。
 * @throws 検証NG。
 */
function validateNotFound(param: any, key?: string, value?: string, name?: string): any {
	// ifでfalseと判定される値の場合、空として例外を投げる
	if (!param) {
		throw new HttpError(404, makeMessage(key, value, name, "is not found"));
	}
	return param;
}

/**
 * 渡された値が数値か検証する。
 * @param param 数値かチェックする値。
 * @param key NG時にキー情報を通知する場合その値。
 * @param value NG時に値情報を通知する場合その値。
 * @param name NG時にモデル名を通知する場合その値。
 * @returns paramの値。
 * @throws 検証NG。
 */
function validateNumber(param: any, key?: string, value?: string, name?: string): number {
	// 変換に失敗する値の場合、数値以外として例外を投げる
	param = Number(param);
	if (isNaN(param)) {
		throw new HttpError(400, makeMessage(key, value, name, "is not number"));
	}
	return param;
}

export default {
	validateNotFound: validateNotFound,
	validateNumber: validateNumber,
	toNumber: validateNumber,
};