/**
 * @file あの人は今？ルートコンポーネント。
 */
import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import localeHelper from './shared/locale-helper';
import { EnvService } from './shared/env.service';

/**
 * あの人は今？ルートコンポーネントクラス。
 */
@Component({
	selector: 'app-root',
	templateUrl: 'app/app.html',
	providers: [EnvService],
})
export class AppComponent {
	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param translate 国際化サービス。
	 * @param envService システム設定サービス。
	 */
	constructor(
		private translate: TranslateService,
		private envService: EnvService) { }

	/**
	 * コンポーネント起動時の処理。
	 */
	async ngOnInit(): Promise<void> {
		// アプリで使用する言語を設定
		this.translate.setDefaultLang('en');
		this.translate.use(localeHelper.getLanguage());

		// アプリ名とバージョンをサーバーから読み込み、ローカライズ設定に動的にマージする
		const env = await this.envService.env();
		for (let lang in env.appName) {
			this.translate.setTranslation(lang, {
				APP_NAME: env.appName[lang],
				VERSION: env.version,
			}, true);
		}
	}
}
