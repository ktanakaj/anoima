/**
 * @file あの人は今？ルートモジュール。
 */
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { TranslateModule } from 'ng2-translate';
import { AppComponent } from './app.component';
import localeHelper  from './shared/locale-helper';

/**
 * あの人は今？ルートモジュールクラス。
 */
@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		TranslateModule.forRoot(),
	],
	declarations: [
		AppComponent,
	],
	providers: [
		{ provide: LOCALE_ID, useValue: localeHelper.getLocale() }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
