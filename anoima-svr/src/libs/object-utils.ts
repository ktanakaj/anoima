/**
 * オブジェクト関連ユーティリティのNode.jsモジュール。
 * @module ./libs/object-utils
 */

/**
 * 入れ子オブジェクトのプロパティを考慮して取得する。
 * @param {Object} obj プロパティを取得するオブジェクト。
 * @param {string} key プロパティのキー。"info.id" のように階層的に指定可能。
 * @returns {Object} プロパティの値。プロパティが見つからない場合undefined。
 */
function get(obj, key) {
	let v;
	for (let k of key.split(".")) {
		v = obj ? obj[k] : undefined;
		obj = v;
	}
	return v;
}

/**
 * 入れ子オブジェクトのプロパティを考慮して設定する。
 * @param {Object} obj プロパティを設定するオブジェクト。
 * @param {string} key プロパティのキー。"info.id" のように階層的に指定可能。
 * @param {Object} value 設定する値。
 */
function set(obj, key, value) {
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
 * @param {Object} target コピーされるオブジェクト。
 * @param {Object} source コピー元のオブジェクト。
 * @param {Array} includes 指定されたプロパティのみをコピーする。
 */
function copy(target, source, includes) {
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

/**
 * オブジェクト配列同士をキーでマージする。
 * @param {Array} objs1 マージ先のオブジェクト配列。
 * @param {Array} objs2 マージ元のオブジェクト配列。
 * @param {string} idKey1 objs1でキーが入っているプロパティ名。
 * @param {string} idKey2 objs2でキーが入っているプロパティ名。
 * @param {string} objKey マージ結果を登録するプロパティ名。set()の形式が使用可。
 * @param {string} valueKey objs2の特定のプロパティのみを登録する場合そのプロパティ名。get()の形式が使用可。
 * @returns {Promise} マージ結果。
 */
function mergeArray(objs1, objs2, idKey1, idKey2, objKey, valueKey) {
	// 結合用にハッシュマップ作成
	const map = {};
	for (let obj1 of objs1) {
		map[obj1[idKey1]] = obj1;
	}

	for (let obj2 of objs2) {
		let obj1 = map[obj2[idKey2]];
		if (obj1) {
			if (valueKey) {
				set(obj1, objKey, get(obj2, valueKey));
			} else {
				set(obj1, objKey, obj2);
			}
		}
	}
	return objs1;
}

export default {
	get: get,
	set: set,
	copy: copy,
	mergeArray: mergeArray,
};
