/**
 * HTTP関連ユーティリティのNode.jsモジュール。
 * @module ./libs/http-utils
 */

/**
 * リクエストのログ用文字列を生成する。
 * @param params リクエスト／レスポンス情報。
 * @returns ログ文字列。
 */
function formatLog(params) {
	params.method = params.method ? params.method.toUpperCase() : "GET";

	let log = params.method + " " + params.url;
	if (params.statusCode) {
		log += " " + params.statusCode;
	}
	if (params.startTimestamp) {
		log += " " + (Date.now() - params.startTimestamp) + " ms";
	}

	if (params.method === "POST" && params.body) {
		log += "\nBODY: ";
		if (params.json) {
			log += JSON.stringify(params.body);
		} else {
			log += params.body;
		}
	}

	if (params.result) {
		log += "\nRESULT: " + params.result;
	}

	return log;
}

/**
 * リクエストのログを生成する。
 * @param options URLまたはrequest-promise形式のリクエスト引数。
 * @param startTimestamp リクエスト開始時点のタイムスタンプ。
 * @return ログ文字列。
 */
function formatSuccessLog(options, startTimestamp: number): string {
	if (typeof options !== "object") {
		options = { url: options };
	}
	return formatLog({
		url: options.url,
		method: options.method,
		statusCode: "OK",
		startTimestamp: startTimestamp,
		body: options.body,
		json: options.json,
	});
}

/**
 * リクエストのエラーログを生成する。
 * @param options URLまたはrequest-promise形式のリクエスト引数。
 * @param startTimestamp リクエスト開始時点のタイムスタンプ。
 * @param error request-promise形式のエラー情報。
 * @return ログ文字列。
 */
function formatErrorLog(options, startTimestamp: number, err): string {
	if (typeof options !== "object") {
		options = { url: options };
	}
	return formatLog({
		url: options.url,
		method: options.method,
		statusCode: err && err.response ? (err.response.statusCode || "NG") : "ERROR",
		startTimestamp: startTimestamp,
		body: options.body,
		json: options.json,
		result: err.error || err,
	});
}

export default {
	formatSuccessLog: formatSuccessLog,
	formatErrorLog: formatErrorLog,
};
