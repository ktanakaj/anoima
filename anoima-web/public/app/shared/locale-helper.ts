/**
 * ロケール処理用のヘルパーモジュール。
 * @module ./app/shared/locale-helper
 */

/**
 * アプリで使用する言語設定を取得する。
 * @returns 2文字の言語コード。
 */
function getLanguage(): string {
	// <html lang="ja"> の言語を返す。デフォルトは英語
	const element = document.documentElement;
	return element.getAttribute('lang') || 'en';
}

/**
 * アプリで使用するロケールを取得する。
 * @returns ロケールコード。
 */
function getLocale(): string {
	// 取得失敗時はデフォルトとしてアメリカを返す
	try {
		return navigator.language;
	} catch (e) {
		return "en-US";
	}
}

export default {
	getLanguage: getLanguage,
	getLocale: getLocale,
};