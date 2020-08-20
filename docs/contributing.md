<!-- # Contributing -->
# コントリビューティング

<!-- - Read the [style guide](./contributing/style_guide.md). -->
- [スタイルガイド](./contributing/style_guide.md) を読んでください。

<!-- - Please don't make [the benchmarks](https://deno.land/benchmarks) worse. -->
- [ベンチマーク](https://deno-ja.vercel.app/benchmarks) を悪くしないでください。

<!-- - Ask for help in the [community chat room](https://discord.gg/deno). -->
- [コミュニティチャットルーム](https://discord.gg/deno) で助けを求めてください。

<!--
- If you are going to work on an issue, mention so in the issue comments
  _before_ you start working on the issue.
-->
- issue で協力したい場合は、協力する前に _前に_ issue でメンションしてください。

<!--
- Please be professional in the forums. We follow
  [Rust's code of conduct](https://www.rust-lang.org/policies/code-of-conduct)
  (CoC) Have a problem? Email ry@tinyclouds.org.
-->
- フォーラムではプロフェッショナルでいてください。[Rust's code of conduct](https://www.rust-lang.org/policies/code-of-conduct) (CoC) に従っています。問題がある場合は、ry@tinyclouds.org にメールを送ってください。

<!-- ## Development -->
## 開発

<!-- 
Instructions on how to build from source can be found
[here](./contributing/building_from_source.md).
-->
ソースからのビルドのガイドは [こちら](./contributing/building_from_source.md) を見てください。

<!-- ## Submitting a Pull Request -->
## プルリクエストの提出

<!-- Before submitting, please make sure the following is done: -->
プルリクエストを提出する前に以下のことが終わっているか確かめてください:

<!--
1. That there is a related issue and it is referenced in the PR text.
2. There are tests that cover the changes.
3. Ensure `cargo test` passes.
4. Format your code with `./tools/format.py`
5. Make sure `./tools/lint.py` passes.
-->
1. 関係するissueがありPRテキストに参照されているかどうか。
2. 変更をカバーするテストが存在するか。
3. `cargo test` をパスするかどうか。
4. `./tools/format.py` でフォーマットされているかどうか。
5. `./tools/lint.py` をパスするかどうか。

<!-- ## Changes to `third_party` -->
## `third_party` への変更

<!--
[`deno_third_party`](https://github.com/denoland/deno_third_party) contains most
of the external code that Deno depends on, so that we know exactly what we are
executing at any given time. It is carefully maintained with a mixture of manual
labor and private scripts. It's likely you will need help from @ry or
@piscisaureus to make changes.
-->
[`deno_third_party`](https://github.com/denoland/deno_third_party) はDenoが依存しているほとんどの外部のコードを含んで、いつでも何を実行しているかを正確に把握することが出来ます。努力とプライベートスクリプトで丁寧にメンテナンスされています。変更するには @ry や @piscisaureus の助けが必要になるでしょう。

<!-- ## Adding Ops (aka bindings) -->
## Ops(別名、バインディング)を追加

<!--
We are very concerned about making mistakes when adding new APIs. When adding an
Op to Deno, the counterpart interfaces on other platforms should be researched.
Please list how this functionality is done in Go, Node, Rust, and Python.
-->
新しいAPIを追加するときにミスをしないかとても心配しています。OpをDenoに追加するとき、他のプラットフォームでの対応するインターフェースを調べておく必要があります。この機能がGo、Node、Rust、Pythonでどのように行われているかリストアップしてください。

<!--
As an example, see how `Deno.rename()` was proposed and added in
[PR #671](https://github.com/denoland/deno/pull/671).
-->
例として、`Deno.rename()` がどのように提案され追加されたか [PR #671](https://github.com/denoland/deno/pull/671) で見てください。

<!-- ## Releases -->
## リリース

<!--
Summary of the changes from previous releases can be found
[here](https://github.com/denoland/deno/releases).
-->
前のリリースからの変更点のまとめは [こちら](https://github.com/denoland/deno/releases) で見つかります。

<!-- ## Documenting APIs -->
## APIのドキュメントの記述

<!--
It is important to document public APIs and we want to do that inline with the
code. This helps ensure that code and documentation are tightly coupled
together.
-->
公開APIのドキュメントを記述することは重要で、インラインでコードと主に記述してほしいです。コードとドキュメントが密に結合していることを確認することが出来ます。

### Utilize JSDoc

<!--
All publicly exposed APIs and types, both via the `deno` module as well as the
global/`window` namespace should have JSDoc documentation. This documentation is
parsed and available to the TypeScript compiler, and therefore easy to provide
further downstream. JSDoc blocks come just prior to the statement they apply to
and are denoted by a leading `/**` before terminating with a `*/`. For example:
-->
すべての公開されているAPIと型は `deno` モジュールと global/`window` 名前空間の療法でJSDocドキュメントが必要です。このドキュメントは解析されTypeScriptで利用可能で、提供が簡単になります。JSDocブロックは適応される文の直前に来ており `/**` で始まり `*/` で終わります。例えば:

<!--
```ts
/** A simple JSDoc comment */
export const FOO = "foo";
```
-->
```ts
/** シンプルなJSDocコメント */
export const FOO = "foo";
```

<!-- Find more at https://jsdoc.app/ -->
詳しくは https://jsdoc.app/ を参照してください
