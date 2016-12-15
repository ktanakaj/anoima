/**
 * 配列関連ユーティリティのNode.jsモジュール。
 * @module ./libs/array-utils
 */

/**
 * 配列をシャッフルする。
 * @param array シャッフルする配列。
 */
function shuffle(array: Array<any>): void {
	var n = array.length, t, i;

	while (n) {
		i = Math.floor(Math.random() * n--);
		t = array[n];
		array[n] = array[i];
		array[i] = t;
	}
}

export default {
	shuffle: shuffle,
};
