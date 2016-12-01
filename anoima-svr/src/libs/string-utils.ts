/**
 * 文字列関連ユーティリティのNode.jsモジュール。
 * @module ./libs/string-utils
 */

/**
 * 文字列の先頭一文字を大文字に変換する。
 * @param str 変換する文字列。
 * @returns 変換した文字列。
 */
function ucfirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 文字列をキャメルコードに変換する。
 * @param str 変換する文字列。
 * @returns 変換した文字列。
 */
function camelize(str: string): string {
	return str.replace(/(\-|\_|\s)(\w)/g, (a, b, c) => {
		return c.toUpperCase();
	});
}

/**
 * 文字列を指定桁で埋める。
 * @param str 桁数を揃える文字列。
 * @param len 必要な桁数。
 * @param chr 埋める文字。
 * @returns 桁数を揃えた文字列。
 */
function lpad(str: string, len: number, chr: string): string {
	if (!chr || chr.length == 0) {
		return str;
	} else if (chr.length > 1) {
		chr = chr.charAt(0);
	}
	for (; str.length < len; str = chr + str);
	return str;
}

export default {
	ucfirst: ucfirst,
	camelize: camelize,
	lpad: lpad,
};
