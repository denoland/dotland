<!-- ## First steps -->
## 最初の一歩

<!-- This page contains some examples to teach you about the fundamentals of Deno. -->
このページにはDenoの基礎を理解するためのサンプルが書かれています。

<!--
This document assumes that you have some prior knowledge of JavaScript,
especially about `async`/`await`. If you have no prior knowledge of JavaScript,
you might want to follow a guide
[on the basics of JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)
before attempting to start with Deno.
-->
このドキュメントはJavaScript、特に`async`/`await`の予備知識が必要です。もしJavaScriptに関する予備知識がない場合Denoを始める前に [JavaScriptの基礎](https://developer.mozilla.org/ja/docs/Learn/JavaScript) を読むことをおすすめします。

### Hello World

<!--
Deno is a runtime for JavaScript/TypeScript which tries to be web compatible and
use modern features wherever possible.
-->
Denoはweb互換の最新の機能を可能な限り取り入れるJavaScript/TypeScriptのランタイムです。

<!--
Browser compatibility means a `Hello World` program in Deno is the same as the
one you can run in the browser:
-->
ブラウザ互換はという意味は、Denoによる `Hello World` プログラムがブラウザで実行するものと同じということです:

```ts
console.log("Welcome to Deno 🦕");
```

<!-- Try the program: -->
こちらを試しください:

```shell
deno run https://deno.land/std@$STD_VERSION/examples/welcome.ts
```

<!-- ### Making an HTTP request -->
### HTTPリクエストを作る

<!--
Many programs use HTTP requests to fetch data from a webserver. Let's write a
small program that fetches a file and prints its contents out to the terminal.
-->
多くのプログラムはwebサーバーからデータを取得するためHTTPリクエストを利用しています。ファイルを取得しコネクションをターミナルに出力する小さなプログラムを書いてみましょう。

<!--
Just like in the browser you can use the web standard
[`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API to
make HTTP calls:
-->
ブラウザと同じようにweb標準の [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) APIを使いHTTPコールが作れます:

```ts
const url = Deno.args[0];
const res = await fetch(url);

const body = new Uint8Array(await res.arrayBuffer());
await Deno.stdout.write(body);
```

<!-- Let's walk through what this application does: -->
アプリケーションが何をしているのかを見ていきましょう:

<!--
1. We get the first argument passed to the application, and store it in the
   `url` constant.
2. We make a request to the url specified, await the response, and store it in
   the `res` constant.
3. We parse the response body as an
   [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer),
   await the response, and convert it into a
   [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
   to store in the `body` constant.
4. We write the contents of the `body` constant to `stdout`.
-->
1. アプリケーションに入ってきた最初の引数を取得し、`url` 定数に保存します。
2. 指定されたurlにリクエストを送り、レスポンスを await し、`res` 定数に保存します。
3. レスポンスボディを [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) にパースし、レスポンスを await し、 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) に変換し、 `body` 定数に保存します。
4. `body` 定数の中身を `stdout` に書き込みます。

<!-- Try it out: -->
こちらを試しください:

```shell
deno run https://deno.land/std@$STD_VERSION/examples/curl.ts https://example.com
```

<!--
You will see this program returns an error regarding network access, so what did
we do wrong? You might remember from the introduction that Deno is a runtime
which is secure by default. This means you need to explicitly give programs the
permission to do certain 'privileged' actions, such as access the network.
-->
ネットワークのアクセスでエラーが表示されるでしょう、何を間違えました？イントロダクションでDenoのランタイムは標準で安全だということを覚えていますか。ネットワークアクセスなどの'特権'の必要な動作にはプログラムに明示的にパーミッションを与える必要があるということです。

<!-- Try it out again with the correct permission flag: -->
正しいパーミッションフラグを与えて再度試してみてください:

```shell
deno run --allow-net=example.com https://deno.land/std@$STD_VERSION/examples/curl.ts https://example.com
```

<!-- ### Reading a file -->
### ファイルの読み込み

<!--
Deno also provides APIs which do not come from the web. These are all contained
in the `Deno` global. You can find documentation for these APIs on
[doc.deno.land](https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts).
-->
Denoはweb由来でないAPIも提供しています。これらはすべて `Deno` グローバルに含まれています。これらのAPIのドキュメントは [doc.deno.land](https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts) にあります。

<!--
Filesystem APIs for example do not have a web standard form, so Deno provides
its own API.
-->
例えばファイルシステムAPIはweb標準のものでは有りません、よってDenoは独自のAPIを提供します。

<!--
In this program each command-line argument is assumed to be a filename, the file
is opened, and printed to stdout.
-->
このプログラムではすべての引数はファイル名とし、ファイルを開き、標準出力に表示します。

```ts
const filenames = Deno.args;
for (const filename of filenames) {
  const file = await Deno.open(filename);
  await Deno.copy(file, Deno.stdout);
  file.close();
}
```

<!--
The `copy()` function here actually makes no more than the necessary
kernel→userspace→kernel copies. That is, the same memory from which data is read
from the file, is written to stdout. This illustrates a general design goal for
I/O streams in Deno.
-->
`copy()` 関数はカーネル→ユーザースペース→カーネル以上にコピーを作りません。つまり、データを読み込んだメモリと同じメモリを標準出力に書き込みます。これはDenoのI/Oストリームの設計目標を表しています。

<!-- Try the program: -->
こちらを試しください:

```shell
deno run --allow-read https://deno.land/std@$STD_VERSION/examples/cat.ts /etc/passwd
```

<!-- ### TCP server -->
### TCPサーバー

<!--
This is an example of a server which accepts connections on port 8080, and
returns to the client anything it sends.
-->
これはポート8080でコネクションを受け、クライアントから送信されたものをそのまま返すサーバーの例です。

```ts
const hostname = "0.0.0.0";
const port = 8080;
const listener = Deno.listen({ hostname, port });
console.log(`Listening on ${hostname}:${port}`);
for await (const conn of listener) {
  Deno.copy(conn, conn);
}
```

<!--
For security reasons, Deno does not allow programs to access the network without
explicit permission. To allow accessing the network, use a command-line flag:
-->
セキュリティ上の理由から、Denoは明示的なパーミッションなしにプログラムがネットワークにアクセスすることが出来ません。ネットワークへのアクセスを許可するにはコマンドラインフラッグを使ってください:

```shell
deno run --allow-net https://deno.land/std@$STD_VERSION/examples/echo_server.ts
```

<!-- To test it, try sending data to it with netcat: -->
テストするために、netcatをつかってサーバーにデータを送信してください:

```shell
$ nc localhost 8080
hello world
hello world
```

<!--
Like the `cat.ts` example, the `copy()` function here also does not make
unnecessary memory copies. It receives a packet from the kernel and sends it
back, without further complexity.
-->
`cat.ts` の例と同じように、`copy()` 関数は不必要なメモリコピーを作りません。カーネルからパケットを受け取り、複雑なことをしないで送り返します。

<!-- ### More examples -->
### その他の例

<!-- You can find more examples, like an HTTP file server, in the `Examples` chapter. -->
HTTPファイルサーバーなどもっと多くの例を見たい場合は `Examples` の章を参照してください。
