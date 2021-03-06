/**
 * @file あの人は今？ブートローダー。
 */
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/retry';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.error(err));
