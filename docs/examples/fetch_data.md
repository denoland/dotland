<!-- # Fetch data -->
# データの取得

<!-- ## Concepts -->
## 概念

<!--
- Like browsers, Deno implements web standard APIs such as
  [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
- Deno is secure by default, meaning explicit permission must be granted to
  access the network
- See also: Deno's [permissions](../getting_started/permissions.md) model
-->
- ブラウザのようにDenoは [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) などのwebスタンダードAPIを実装しています。
- Denoはデフォルトで安全です。つまりネットワークへのアクセスには明示的にパーミッションが許可される必要があります
- Denoの [パーミッション](../getting_started/permissions.md) モデルも見てください

<!-- ## Overview -->
## 概要

<!--
When building any sort of web application developers will usually need to
retrieve data from somewhere else on the web. This works no differently in Deno
than in any other JavaScript application, just call the the `fetch()` method.
For more information on fetch read the
[MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
-->
webアプリケーションのブルド時、開発者はwebのどこかからデータを取得する必要があるでしょう。これを実行するのにDenoとほかのJavaScriptアプリケーションで違いはありません、`fetch()` メソッドを呼び出してください。fetchに関するさらなる情報は [MDN documentation](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API) を読んでください。

<!--
The exception with Deno occurs when running a script which makes a call over the
web. Deno is secure by default which means access to IO (Input / Output) is
prohibited. To make a call over the web Deno must be explicitly told it is ok to
do so. This is achieved by adding the `--allow-net` flag to the `deno run`
command.
-->
Denoの例外は、webで呼び出しを行うスクリプトを実行時に発生します。Denoはデフォルトで安全であり、IO(Input/Output)にアクセスすることは禁止されています。webで呼び出しを行うためにはDenoに明示的に伝えなければいけません。`deno run` コマンド時に　`--allow-net` フラグを追加することで実現します。

<!-- ## Example -->
## 例

**Command:** `deno run --allow-net fetch.ts`

```js
/**
 * Output: JSON Data
 */
const json = fetch("https://api.github.com/users/denoland");

json.then((response) => {
  return response.json();
}).then((jsonData) => {
  console.log(jsonData);
});

/**
 * Output: HTML Data
 */
const text = fetch("https://deno.land/");

text.then((response) => {
  return response.text();
}).then((textData) => {
  console.log(textData);
});

/**
 * Output: Error Message
 */
const error = fetch("https://does.not.exist/");

error.catch((error) => console.log(error.message));
```
