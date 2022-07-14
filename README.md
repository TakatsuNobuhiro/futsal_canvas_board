# プロダクトの概要説明
webで使えるフットサルの戦術ボード。
レスポンシブ対応しているのでスマフォやタブレットでも仕様可能。

## プロダクトを作ろうと思ったきっかけ
フットサルの戦術ブログをやっている程フットサルが大好きで、フットサルの戦術ボードwebアプリがネット上にほとんど見当たらなかったから。
また、zoom等によるオンラインミーティングをやる機会がスポーツ業界全般で増えてきたので一定の需要があると思ったため。

## 使用技術
- firebase (real-time,hosting)
- nuxt2,vue2
- typescript(nuxt-property-decorator)
- githubActions

## 苦労した点
- レスポンシブに対応するためにdomを操作するのではなく、オブジェクトの座標をリストで管理してcanvasで毎イベント描画するという技術的に難しいことに挑戦したこと
- eventやdomを扱うときの型定義（mdn公式リファレンスを参照して調べました）
- リストの浅いコピー、深いコピーを意識したこと。（undo機能を実装するとき、リストの深いコピーを渡さないとオブジェクトの座標が一個変わったときにすべて変わってしまうという現象が起きてしまう）
- githubActionsを使ってCI/CDパイプラインを構築したこと

## プロダクトの開発期間
2022年6月~現在

## プロダクトの使い方
- マウスや指でオブジェクトをドラッグアンドドロップして動かす。
- SNS等で共有したいときは下の方にある画像ダウンロード機能を仕様する。
- 一つ前に戻りたい場合は下の方にある一つ前に戻る(undo)のボタンを押す

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate

# package-lock.jsonからインストール
$ npm ci
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).


### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).
