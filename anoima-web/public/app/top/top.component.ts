/**
 * トップページコンポーネント。
 * @module ./app/top/top.component
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { Person } from '../shared/person';
import { PersonService } from '../shared/person.service';

/**
 * トップページコンポーネントクラス。
 */
@Component({
	templateUrl: 'app/top/top.html',
	providers: [PersonService],
})
export class TopComponent implements OnInit {
	/** アプリ情報 */
	appInfo = { appName: '', version: '' };
	/** あの人リスト */
	people: Person[] = [];
	/** フォーム入力値 */
	form: { key: string } = { key: '' };

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param router ルーター。
	 * @param translate 国際化サービス。
	 * @param service あの人関連サービス。
	 */
	constructor(
		private router: Router,
		private translate: TranslateService,
		private personService: PersonService) { }

	/**
	 * コンポーネント起動時の処理。
	 */
	ngOnInit(): void {
		// loadAppInfoはアプリ起動時点では入っていない可能性があるので、その場合更新時に再実行
		this.loadAppInfo();
		this.translate.onTranslationChange.subscribe(() => this.loadAppInfo());
		this.reload();
	}

	/**
	 * 画面情報再読み込み処理。
	 */
	async reload(): Promise<void> {
		// ランダムで20件のあの人を表示
		this.people = await this.personService.random(20);
	}

	/**
	 * アプリ情報読み込み処理。
	 */
	loadAppInfo(): void {
		// アプリ名を動的に埋め込むため、ここで変数に詰める
		this.translate.get('APP_NAME').subscribe((res: string) => {
			this.appInfo.appName = res;
		});
		this.translate.get('VERSION').subscribe((res: string) => {
			this.appInfo.version = res;
		});
	}

	/**
	 * あの人表示。
	 */
	async findByKey(): Promise<void> {
		this.router.navigate(['/persons', this.form.key]);
	}
}
