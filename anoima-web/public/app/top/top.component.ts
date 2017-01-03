/**
 * トップページコンポーネント。
 * @module ./app/top/top.component
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { UserService } from '../shared/user.service';
import { PersonService } from '../shared/person.service';
import { User } from '../shared/user';
import { Person } from '../shared/person';

/**
 * トップページコンポーネントクラス。
 */
@Component({
	templateUrl: 'app/top/top.html',
	providers: [UserService, PersonService],
})
export class TopComponent implements OnInit {
	/** アプリ情報 */
	appInfo = { appName: '', version: '' };
	/** ユーザー情報 */
	me: User;
	/** あの人リスト */
	people: Person[] = [];
	/** フォーム入力値 */
	form: { key: string } = { key: '' };

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param router ルーター。
	 * @param translate 国際化サービス。
	 * @param userService ユーザー関連サービス。
	 * @param service あの人関連サービス。
	 */
	constructor(
		private router: Router,
		private translate: TranslateService,
		private userService: UserService,
		private personService: PersonService) { }

	/**
	 * コンポーネント起動時の処理。
	 */
	async ngOnInit(): Promise<void> {
		// ※ loadAppInfoはアプリ起動時点では入っていない可能性があるので、その場合更新時に再実行
		this.loadAppInfo();
		this.translate.onTranslationChange.subscribe(() => this.loadAppInfo());
		this.me = await this.userService.auth();
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
