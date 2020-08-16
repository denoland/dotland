<!-- ## Command line interface -->
## コマンドラインインターフェース

<!--
Deno is a command line program. You should be familiar with some simple commands
having followed the examples thus far and already understand the basics of shell
usage.
-->
Denoはコマンドラインプログラムです。これまでの例を見てきてシンプルなコマンドに慣れてるはずで、シェルの基本的な使いは理解してるはずです。

<!-- There are multiple ways of viewing the main help text: -->
メインのヘルプページを見るのに様々な方法があります:

<!--
```shell
# Using the subcommand.
deno help

# Using the short flag -- outputs the same as above.
deno -h

# Using the long flag -- outputs more detailed help text where available.
deno --help
```
-->
```shell
# サブコマンドを使う。
deno help

# ショートフラグを使う -- 出力結果は上記と同じです。
deno -h

# ロングフラグを使う -- 利用可能な場合、より詳しいヘルプテキストを出力します。
deno --help
```

<!--
Deno's CLI is subcommand-based. The above commands should show you a list of
those supported, such as `deno bundle`. To see subcommand-specific help for
`bundle`, you can similarly run one of:
-->
DenoのCLIはサブコマンドベースです。上記のコマンドは `deno bundle` などサポートされているサブコマンドを表示するはずです。`bundle` サブコマンド限定のヘルプを表示するには以下のどれかを実行してください:

```shell
deno help bundle
deno bundle -h
deno bundle --help
```

<!-- Detailed guides to each subcommand can be found [here](../tools.md). -->
それぞれのサブコマンドの詳しいガイドは[こちら](../tools.md)で見つかります。

<!-- ### Script source -->
### スクリプトソース

<!--
Deno can grab the scripts from multiple sources, a filename, a url, and '-' to
read the file from stdin. The last is useful for integration with other
applications.
-->
Denoはファイル、url、標準入力から '-' を用いるなど様々なソースからスクリプトを取得することが出来ます。標準入力は他のアプリケーションとの統合に便利です。

```shell
deno run main.ts
deno run https://mydomain.com/main.ts
cat main.ts | deno run -
```

<!-- ### Script arguments -->
### スクリプト引数

<!--
Separately from the Deno runtime flags, you can pass user-space arguments to the
script you are running by specifying them after the script name:
-->
Denoランタイムフラグとは別に、スクリプト名のあとにユーザー空間引数を指定することで、実行中のスクリプトにユーザー空間引数を渡すことが出来ます:

```shell
deno run main.ts a b -c --quiet
```

```ts
// main.ts
console.log(Deno.args); // [ "a", "b", "-c", "--quiet" ]
```

<!--
**Note that anything passed after the script name will be passed as a script
argument and not consumed as a Deno runtime flag.** This leads to the following
pitfall:
-->
**スクリプト名のあとに渡されたものはすべてスクリプト引数として渡され、Denoランタイムフラグとはみなされません。** これは次のような落とし穴につながります。

<!--
```shell
# Good. We grant net permission to net_client.ts.
deno run --allow-net net_client.ts

# Bad! --allow-net was passed to Deno.args, throws a net permission error.
deno run net_client.ts --allow-net
```
-->
```shell
# 良い例。net_client.ts にパーミッションを許可。
deno run --allow-net net_client.ts

# 悪い例! --allow-net はDeno.argsに渡され、ネットパーミッションエラーが投げられます。
deno run net_client.ts --allow-net
```

<!-- Some see it as unconventional that: -->
以下のことは慣習に従っていないと見る人もいます「:

<!-- a non-positional flag is parsed differently depending on its position. -->
位置が決まってないフラグは位置によって別の意味にパースされます。

<!-- However: -->
しかし:

<!--
1. This is the most logical way of distinguishing between runtime flags and
   script arguments.
2. This is the most ergonomic way of distinguishing between runtime flags and
   script arguments.
3. This is, in fact, the same behaviour as that of any other popular runtime.
   - Try `node -c index.js` and `node index.js -c`. The first will only do a
     syntax check on `index.js` as per Node's `-c` flag. The second will
     _execute_ `index.js` with `-c` passed to `require("process").argv`.
-->
1. これはランタイムフラグとスクリプト引数を区別する最も論理的な方法です。
2. これはランタイムフラグとスクリプト引数を区別する最も人間工学的な方法です。
3. これは実際に他の人気のランタイムと同じ動作をします。
   - `node -c index.js` と `node inde.js -c` を試してくてください最初の方はNodeの `-c` フラグに従った `index.js` の構文チェックしかしないです。2番目は `-c` を `require("process").argv` に渡して `index.js` を _実行します_。

---

<!--
There exist logical groups of flags that are shared between related subcommands.
We discuss these below.
-->
関連するサブコマンド間で共有されるフラグの論理グループが存在します。これについて説明します。

### Integrity flags

<!--
Affect commands which can download resources to the cache: `deno cache`,
`deno run` and `deno test`.
-->
リソースをキャッシュする `deno cache`、`deno run`、`deno test` コマンドにに影響を与えます。

```
--lock <FILE>    Check the specified lock file
--lock-write     Write lock file. Use with --lock.
```

<!--
Find out more about these
[here](../linking_to_external_code/integrity_checking.md).
-->
これらについてより詳しくは [こちら](../linking_to_external_code/integrity_checking.md) を参照してください。

### Cache and compilation flags

Affect commands which can populate the cache: `deno cache`, `deno run` and
`deno test`. As well as the flags above this includes those which affect module
resolution, compilation configuration etc.

```
--config <FILE>               Load tsconfig.json configuration file
--importmap <FILE>            UNSTABLE: Load import map file
--no-remote                   Do not resolve remote modules
--reload=<CACHE_BLOCKLIST>    Reload source code cache (recompile TypeScript)
--unstable                    Enable unstable APIs
```

### Runtime flags

Affect commands which execute user code: `deno run` and `deno test`. These
include all of the above as well as the following.

#### Permission flags

These are listed [here](./permissions.md#permissions-list).

#### Other runtime flags

More flags which affect the execution environment.

```
--cached-only                Require that remote dependencies are already cached
--inspect=<HOST:PORT>        activate inspector on host:port ...
--inspect-brk=<HOST:PORT>    activate inspector on host:port and break at ...
--seed <NUMBER>              Seed Math.random()
--v8-flags=<v8-flags>        Set V8 command line options. For help: ...
```
