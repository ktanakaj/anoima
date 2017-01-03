/**
 * ユーザー認証のルーティングガードモジュール。
 * @module ./app/shared/user-auth-guard.service
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../shared/user.service';

/**
 * ユーザー認証のルーティングガードクラス。
 */
@Injectable()
export class UserAuthGuard implements CanActivate {
	/**
	 * サービスをDIしてモジュールを生成する。
	 * @param router ルーター。
	 * @param userService ユーザー関連サービス。
	 */
	constructor(
		private router: Router,
		private userService: UserService) { }

	/**
	 * ページへのアクセス可否を判定する。
	 * @param route
	 * @param state
	 * @returns アクセス可の場合true。
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		//TODO: ユーザー認証が必要なページにガードかける、管理者版も作る
		console.log('AuthGuard#canActivate called');
		return true;
	}
}