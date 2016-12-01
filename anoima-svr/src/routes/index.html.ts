/**
 * トップページコントローラのNode.jsモジュール。
 *
 * あの人は今？Webアプリのトップページを生成する。
 * @module './routes/index.html'
 */
import * as express from 'express';
import * as url from 'url';
import * as config from 'config';
import * as langParser from 'accept-language-parser';
const router = express.Router();

// TOPページ
router.get('/', function (req, res) {
	// ※ 言語やパスなど一部動的に埋め込みたいのでnode.js側で生成
	// 言語はパラメータlang→ヘッダー→デフォルトenの順に判定
	const langs = langParser.parse(req.headers['accept-language']);
	let lang = req.query.lang || (langs[0] ? langs[0].code : '');
	if (!config.appName[lang]) {
		// TODO: 英語対応したらデフォルト英語にする
		//lang = 'en';
		lang = 'ja';
	}
	res.render('index', {
		lang: lang,
		base: url.format({
			protocol: req.protocol,
			hostname: req.headers.host,
			pathname: config.webappbase
		}),
		appName: config.appName[lang],
	});
});

export default router;
