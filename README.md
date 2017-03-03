# あの人は今？
あの人は今？は「あの人は今どうしてるの？」という話題をテーマに、友達や同級生、有名人なんかの噂話やゴシップを書きこんで、友達同士でワイワイ楽しむ裏サイトです(><;

…という飲み会のノリで作り始めたソースですが、途中で飽きたので開発中断。。。  
部品取り用に置いておくので、Node.js+TypeScript+SequelizeなWeb APIの参考にでもどうぞ。

## 機能
### 実装済
※ 実装済みであっても検証は思いっきり不完全。ちゃんと機能するかはお試し。  
※ 現状ほぼAPIのみ実装、画面はあんまない、、、

* あの人API
    * ランダム一覧表示
    * ページ閲覧（非公開だけどURL知ってれば誰でも見れる系）
    * ページ作成
    * 情報追加
    * コメント
    * お気に入り登録
* 管理者API
    * 管理者登録
    * ヤバいユーザーBAN
    * ヤバいネタ非表示
* 一般ユーザー認証（Facebook/開発用ダミー）
* 管理者認証（ID/パスワード）
* DBの水平分割
* DBのMySQLでのMaster/Slave構成
* SwaggerUIでのAPIテスト実行
* ユニットテストの仕組み
* 国際化の仕組み

### 未対応
* 画面たくさん
* 画面デザイン
* クライアント側の認証周り詳細
* あの人API
    * 情報を信じる信じないとか投票
* 管理者API
    * ログとか見れる
* ユニットテストのテスト
* 動作確認
* 負荷試験
* その他いろんなものたくさん

## 環境
* CentOS 7
* Node.js v6.9.x
* MariaDB 5.5.x
* nginx 1.10.x
* TypeScript 2.x
* Express 4.x
    * Sequelize 3.x
    * Passport 0.3.x
    * Node-config 1.x
    * Log4js 1.x
* Angular 2.x
    * webpack 2.x
    * ng2-translate 5.x
* Mocha 3.x
    * Power-assert 1.x

### 対応ブラウザ
* &gt;= Google Chrome Ver51.0.2704.106

※ 他は未確認

### 開発環境
* Vagrant 1.8.x - 仮想環境管理
    * VirtualBox 5.0.x - 仮想環境
    * vagrant-vbguest - Vagrantプラグイン
* Visual Studio Code - アプリ開発用エディター
* MySQL Workbench 6.x - DB管理・EL図作成用ツール

## フォルダ構成
* VMルートフォルダ
    * anoima-db - ER図
    * anoima-svr - Node.js Webアプリサーバーソース
        * config - アプリ設定
    * anoima-web - Angular2 Webアプリクライアントソース
    * vagrant-conf - Vagrant関連ファイル

## 環境構築手順
1. Vagrantをインストールした後、ファイル一式をVMのフォルダとする場所に展開。
* `vagrant up` でVM環境を構築（DB構築やアプリの初回ビルド等も自動実行）。

※ `npm install` でエラーになる場合は `vagrant provision` でもう一度実行してみてください。  
※ Facebook認証を使用するためには、Facebookにアカウント登録を行い、`local.yaml` でその情報を設定する必要があります。

## 実行方法
WebアプリはVM起動時に自動的に立ち上がります。

デフォルトのVMでは http://172.16.10.14/ または http://localhost/ でアクセス可能です。

※ Microsoft EdgeだとプライベートIP（前者）はアクセスできない場合あり。  
※ 自動的に立ち上がらない場合は、後述のサーバーコマンドで起動してください。

### サーバーコマンド
Webアプリの操作用に、以下のようなサーバーコマンドを用意しています。
アプリのビルドや再起動などを行う場合は、VMにログインして `anoima-svr`, `anoima-web` ディレクトリでコマンドを実行してください。

* `anoima-svr`
    * `npm start` - アプリの起動
        * `npm run production` アプリの起動（運用モード）
    * `npm restart` - アプリの再起動
    * `npm stop` - アプリの停止
* `anoima-svr/anoima-web`共通
    * `npm run build` - アプリのビルド
    * `npm run watch` - アプリのビルド（ファイル更新監視）
    * `npm run doc` - アプリのAPIドキュメント生成
    * `npm test` - アプリのユニットテスト実行
    * `npm run tslint` - アプリの静的解析ツールの実行
    * `npm run clean` - 全ビルド生成物の削除

## その他
各種ログは `/var/log/local/anoima` 下に出力されます。
アクセスログ、デバッグログ、エラーログ、それに通信ログを出力します。

VMのDBを参照する場合は、MySQL Workbench等でMySQLの標準ポートに接続してください（接続情報は `default.yaml` 参照）。  
DBは垂直分割を想定して、`global` と `shardable` に分かれています。  
（さらにそれぞれMySQLのマスタ／スレーブ構成に拡張できるつもりで設定されています。）

またVMにはSwaggerのAPIデバッグページがあります。http://172.16.10.14/swagger/?url=/api-docs.json でアクセス可能です。

## ライセンス
[MIT](https://github.com/ktanakaj/anoima/blob/master/LICENSE)
