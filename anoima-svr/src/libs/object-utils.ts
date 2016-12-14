/**
 * オブジェクト関連ユーティリティのNode.jsモジュール。
 * @module ./libs/object-utils
 */

/**
 * 入れ子オブジェクトのプロパティを考慮して取得する。
 * @param obj プロパティを取得するオブジェクト。
 * @param key プロパティのキー。"info.id" のように階層的に指定可能。
 * @returns プロパティの値。プロパティが見つからない場合undefined。
 */
function get(obj: Object, key: string): any {
	let v;
	for (let k of key.split(".")) {
		v = obj ? obj[k] : undefined;
		obj = v;
	}
	return v;
}

/**
 * 入れ子オブジェクトのプロパティを考慮して設定する。
 * @param obj プロパティを設定するオブジェクト。
 * @param key プロパティのキー。"info.id" のように階層的に指定可能。
 * @param value 設定する値。
 */
function set(obj: Object, key: string, value: any) {
	const keys = key.split(".");
	for (let i = 0; i < keys.length - 1; i++) {
		// 途中の階層がない場合、空のオブジェクトを詰める
		if (!obj[keys[i]]) {
			obj[keys[i]] = {};
		}
		// 参照を一つ下に移動
		obj = obj[keys[i]];
	}
	obj[keys[keys.length - 1]] = value;
}

/**
 * オブジェクトのプロパティをコピーする。
 * @param target コピーされるオブジェクト。
 * @param source コピー元のオブジェクト。
 * @param includes 指定されたプロパティのみをコピーする。
 */
function copy(target: Object, source: Object, includes?: Array<string>) {
	if (includes === undefined) {
		Object.assign(target, source);
		return;
	}
	for (let key of includes) {
		// 存在するプロパティのみをコピーする
		let value = source[key];
		if (value !== undefined) {
			target[key] = value;
		}
	}
}

export default {
	get: get,
	set: set,
	copy: copy,
};
