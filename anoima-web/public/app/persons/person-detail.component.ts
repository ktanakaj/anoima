/**
 * あの人詳細ページコンポーネント。
 * @module ./app/persons/person-detail.component
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../shared/user.service';
import { PersonService } from '../shared/person.service';
import { Person } from '../shared/person';
import { User } from '../shared/user';

/**
 * あの人詳細ページコンポーネントクラス。
 */
@Component({
	templateUrl: 'app/persons/person-detail.html',
})
export class PersonDetailComponent implements OnInit {
	/** ユーザー情報 */
	me: User;
	/** あの人 */
	person: Person = { name: '' };

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param route ルート情報。
	 * @param userService ユーザー関連サービス。
	 * @param personService あの人関連サービス。
	 */
	constructor(
		private route: ActivatedRoute,
		private userService: UserService,
		private personService: PersonService) { }

	/**
	 * コンポーネント起動時の処理。
	 */
	async ngOnInit(): Promise<void> {
		this.me = await this.userService.auth();
		this.person = await this.personService.findByKey(this.route.snapshot.params['key']);
	}

	/**
	 * あの人情報投稿ダイアログを開く。
	 */
	openInfoDialog(): void {
		//TODO: 要実装
		window.alert('未実装。APIで直接投稿してください。');
	}

	/**
	 * あの人or情報へのコメントダイアログを開く。
	 */
	openCommentDialog(): void {
		//TODO: 要実装
		window.alert('未実装。APIで直接投稿してください。');
	}
}
