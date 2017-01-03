/**
 * あの人新規登録ページコンポーネント。
 * @module ./app/persons/person-new.component
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { PersonService } from '../shared/person.service';
import { Person } from '../shared/person';

/**
 * あの人新規登録ページコンポーネントクラス。
 */
@Component({
	templateUrl: 'app/persons/person-new.html',
	providers: [PersonService],
})
export class PersonNewComponent {
	/** フォーム入力値 */
	form: Person = { privacy: 'public' };
	/** エラー情報 */
	error: string;

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param router ルーター。
	 * @param service あの人関連サービス。
	 */
	constructor(
		private router: Router,
		private personService: PersonService) { }

	/**
	 * フォームサブミット時の処理。
	 */
	onSubmit() {
		this.personService.create(this.form)
			.then((person) => this.router.navigate(['/persons', person.map.key]))
			.catch((error) => this.error = error.message || error);
	}
}
