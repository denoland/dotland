<!-- # Linking to third party code -->
# サードパーティコードへのリンク

<!--
In the [Getting Started](./getting_started.md) section, we saw Deno could
execute scripts from URLs. Like browser JavaScript, Deno can import libraries
directly from URLs. This example uses a URL to import an assertion library:
-->
[Getting Started](./getting_started.md) の章で、DenoはURLからのスクリプトを実行できることを確認しました。ブラウザのJavaScriptと同様にDenoはライブラリをURLから直接インポートできます。この例ではURLを使って assertion ライブラリをインポートします:

**test.ts**

```ts
import { assertEquals } from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";

assertEquals("hello", "hello");
assertEquals("world", "world");

console.log("Asserted! ✓");
```

<!-- Try running this: -->
こちらを試してみてください:

```shell
$ deno run test.ts
Compile file:///mnt/f9/Projects/github.com/denoland/deno/docs/test.ts
Download https://deno.land/std@$STD_VERSION/testing/asserts.ts
Download https://deno.land/std@$STD_VERSION/fmt/colors.ts
Download https://deno.land/std@$STD_VERSION/testing/diff.ts
Asserted! ✓
```

<!--
Note that we did not have to provide the `--allow-net` flag for this program,
and yet it accessed the network. The runtime has special access to download
imports and cache them to disk.
-->
このプログラムに `--allow-net` フラグをつけつ必要がないにもかかわらず、ネットワークにアクセスしたことに注意してください。ランタイムはインポートをダウンロードしてディスクにキャッシュする特別なアクセス権を持っています。

<!--
Deno caches remote imports in a special directory specified by the `DENO_DIR`
environment variable. It defaults to the system's cache directory if `DENO_DIR`
is not specified. The next time you run the program, no downloads will be made.
If the program hasn't changed, it won't be recompiled either. The default
directory is:
-->
Deno `DENO_DIR` 環境変数で指定されたディレクトリにリモートインポートをキャッシュします。`DENO_DIR` が指定されなかった場合システムのキャッシュディレクトリがデフォルトになります。次にプログラムを実行したときはダウンロードされません。もしプログラムに変更がない場合再コンパイルもしません。デフォルトディレクトリは:

- On Linux/Redox: `$XDG_CACHE_HOME/deno` or `$HOME/.cache/deno`
- On Windows: `%LOCALAPPDATA%/deno` (`%LOCALAPPDATA%` = `FOLDERID_LocalAppData`)
- On macOS: `$HOME/Library/Caches/deno`
- If something fails, it falls back to `$HOME/.deno`

## FAQ

<!-- ### How do I import a specific version of a module? -->
### 特定のバージョンのモジュールをインポートするにはどうすればいいですか？

<!--
Specify the version in the URL. For example, this URL fully specifies the code
being run: `https://unpkg.com/liltest@0.0.5/dist/liltest.js`.
-->
URLでバージョンを指定してください。例えば、このURLは実行されるコードを指定しています: `https://unpkg.com/liltest@0.0.5/dist/liltest.js`。

<!-- ### It seems unwieldy to import URLs everywhere. -->
## すべての場所でURLをインポートするのは面倒くさそうです。

<!-- > What if one of the URLs links to a subtly different version of a library? -->
> もしURLの1つが微妙に違うバージョンのライブラリにリンクしてる場合はどうなりますか？

<!-- > Isn't it error prone to maintain URLs everywhere in a large project? -->
> 大きなプロジェクトでは様々な場所にあるURLをメンテナンスすることは間違えやすいのではないですか？

<!--
The solution is to import and re-export your external libraries in a central
`deps.ts` file (which serves the same purpose as Node's `package.json` file).
For example, let's say you were using the above assertion library across a large
project. Rather than importing
`"https://deno.land/std@$STD_VERSION/testing/asserts.ts"` everywhere, you could
create a `deps.ts` file that exports the third-party code:
-->
解決策は外部ライブラリを `deps.ts` ファイルでインポートして再エクスポートすることです。
例えば、大きなプロジェクトで上記の assertion ライブラリを使うとしましょう。すべての場所で `"https://deno.land/std@$STD_VERSION/testing/asserts.ts"` でインポートするより、サードパーティコードをエクスポートする `deps.ts` ファイルを作ることが出来ます:

**deps.ts**

```ts
export {
  assert,
  assertEquals,
  assertStrContains,
} from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";
```

<!--
And throughout the same project, you can import from the `deps.ts` and avoid
having many references to the same URL:
-->
プロジェクト全体で`deps.ts` からインポートすることが出来、同じURLへの多くの参照を避けることが出来ます

```ts
import { assertEquals, runTests, test } from "./deps.ts";
```

<!--
This design circumvents a plethora of complexity spawned by package management
software, centralized code repositories, and superfluous file formats.
-->
この設計はパッケージマネージャ、集中化されたコードリポジトリ、余計なファイル形式によって生まれる複雑さを避けます。

<!-- ### How can I trust a URL that may change? -->
### 変更されるかもしれないURLをなぜ信用することが出来ますか？

<!--
By using a lock file (with the `--lock` command line flag), you can ensure that
the code pulled from a URL is the same as it was during initial development. You
can learn more about this
[here](./linking_to_external_code/integrity_checking.md).
-->
lock ファイルを使うこと(`--lock` コマンドラインフラグ付きで)で、元の開発環境と同じURLからコードを引っ張ってくることを保証します。

<!-- ### But what if the host of the URL goes down? The source won't be available. -->
### でも、もしURLのホストがダウンしたら？ ソースは利用できないでしょう。

<!--
This, like the above, is a problem faced by _any_ remote dependency system.
Relying on external servers is convenient for development but brittle in
production. Production software should always vendor its dependencies. In Node
this is done by checking `node_modules` into source control. In Deno this is
done by pointing `$DENO_DIR` to some project-local directory at runtime, and
similarly checking that into source control:
-->
これは上記と同じようにどのリモート依存関係システムにも言えることです。
外部サーバーを経由することは開発にとって便利なことですが、プロダクションでは脆いです。プロダクションソフトウェアは常に依存関係をベンダー化すべきです。Nodeではこれはソースコントロールに `node_modules` を確認することにより行われます。Denoでは実行時にプロジェクトローカルに `$DENO_DIR` を指すことで行われ、同じようなソースコントロールの確認をします:

<!--
```shell
# Download the dependencies.
DENO_DIR=./deno_dir deno cache src/deps.ts

# Make sure the variable is set for any command which invokes the cache.
DENO_DIR=./deno_dir deno test src

# Check the directory into source control.
git add -u deno_dir
git commit
```
-->
```shell
# 依存関係をダウンロード。
DENO_DIR=./deno_dir deno cache src/deps.ts

# 変数がキャッシュを呼び出すどのコマンドにもセットされているか確認。
DENO_DIR=./deno_dir deno test src

# ソースコントロールにディレクトリを確認。
git add -u deno_dir
git commit
```
