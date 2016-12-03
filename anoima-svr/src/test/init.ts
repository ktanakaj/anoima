/**
 * ユニットテストの初期化処理モジュール。
 * @module ./test/init
 */
import * as config from 'config';
import * as log4js from 'log4js';
log4js.configure(config['log4js']);
