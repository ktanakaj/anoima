/**
 * 認証コンポーネント。
 * @module ./app/auth/auth.component
 */
import { Component, OnInit } from '@angular/core';
import browserHelper from '../core/browser-helper';
import { UserService } from '../shared/user.service';
import { EnvService } from '../shared/env.service';
import { User } from '../shared/user';

/**
 * 認証コンポーネントクラス。
 */
@Component({
	selector: 'auth',
	templateUrl: 'app/auth/auth.html',
	providers: [UserService, EnvService],
})
export class AuthComponent implements OnInit {
	/** ユーザー情報 */
	me: User;
	/** 環境情報 */
	environment: string;
	/** フォーム入力値 */
	form: { dummyId: string } = { dummyId: '' };

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param userService ユーザー関連サービス。
	 * @param envService システム設定サービス。
	 */
	constructor(
		private userService: UserService,
		private envService: EnvService) { }

	/**
	 * コンポーネント起動時の処理。
	 */
	async ngOnInit(): Promise<void> {
		// 認証情報読み込み
		this.me = await this.userService.auth();

		// 環境情報を読み込む
		const env = await this.envService.env();
		this.environment = env.environment;
	}

	/**
	 * 開発環境用ダミー認証でログイン。
	 */
	async loginByDummy(): Promise<void> {
		// ※ 認証情報を反映するために画面を再読み込み
		this.me = await this.userService.loginByDummy(this.form.dummyId);
		browserHelper.reload();
	}

	/**
	 * ログアウト。
	 */
	async logout(): Promise<void> {
		// ※ 要認証ページを開いている可能性があるのでトップに飛ばす
		await this.userService.logout();
		this.me = null;
		browserHelper.redirect('/');
	}
}
