/**
 * 数値関連ユーティリティのNode.jsモジュール。
 * @module ./libs/number-utils
 */

/**
 * 指定された範囲の乱数値を整数で取得する。
 * @param min 最小値。
 * @param max 最大値。
 * @returns 乱数値。
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
	randomInt: randomInt,
};
