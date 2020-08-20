<!-- ## Integrity checking & lock files -->
## 整合性チェック & ロックファイル

<!-- ### Introduction -->
### イントロダクション

<!--
Let's say your module depends on remote module `https://some.url/a.ts`. When you
compile your module for the first time `a.ts` is retrieved, compiled and cached.
It will remain this way until you run your module on a new machine (say in
production) or reload the cache (through `deno cache --reload` for example). But
what happens if the content in the remote url `https://some.url/a.ts` is
changed? This could lead to your production module running with different
dependency code than your local module. Deno's solution to avoid this is to use
integrity checking and lock files.
-->
あるモジュールがリモートモジュール `https://some.url/a.ts` に依存しているとしましょう。そのモジュールを初めてコンパイルするとき `a.ts` が取得され、コンパイルされ、キャッシュされます。新しいマシン(プロダクションとしましょう)でモジュールを実行するまで、あるいはキャッシュを再ロードする(例えば、`deno cache --reload` を使って)までこの状態のままになります。しかし、リモートURLの `https://some.url/a.ts` の内容が変更された場合はどうなるでしょう？これはローカルモジュールとは異なる依存関係のコードでプロダクションが運用されている可能性があります。Denoはこの問題を避けるため整合性チェックとロックファイルを使います。

<!-- ### Caching and lock files -->
### キャッシングとロックファイル

<!--
Deno can store and check subresource integrity for modules using a small JSON
file. Use the `--lock=lock.json` to enable and specify lock file checking. To
update or create a lock use `--lock=lock.json --lock-write`. The
`--lock=lock.json` tells Deno what the lock file to use is, while the
`--lock-write` is used to output dependency hashes to the lock file
(`--lock-write` must be used in conjunction with `--lock`).
-->
Denoは小さなJSONファイルを使ってモジュールのサブリソースの整合性を保存、チェックすることが出来ます。ロックファイルのチェックを有効にし指定するには、`--lock=lock.json` を使ってください。ロックファイルを更新したり作成したりするには `--lock=lock.json --lock-write` を使ってください。`--lock=lock.json` はDenoにどのロックファイルが使われるかを指定し、`--lock-write` は依存関係ハッシュをロックファイルに出力するのに使われます(`--lock-write` は `--lock` と併用しなければなりません)。

<!--
A `lock.json` might look like this, storing a hash of the file against the
dependency:
-->
`lock.json` は次のようになり、依存関係に応じたファイルのハッシュを格納します:

```json
{
  "https://deno.land/std@$STD_VERSION/textproto/mod.ts": "3118d7a42c03c242c5a49c2ad91c8396110e14acca1324e7aaefd31a999b71a4",
  "https://deno.land/std@$STD_VERSION/io/util.ts": "ae133d310a0fdcf298cea7bc09a599c49acb616d34e148e263bcb02976f80dee",
  "https://deno.land/std@$STD_VERSION/async/delay.ts": "35957d585a6e3dd87706858fb1d6b551cb278271b03f52c5a2cb70e65e00c26a",
   ...
}
```

A typical workflow will look like this:

**src/deps.ts**

<!--
```ts
// Add a new dependency to "src/deps.ts", used somewhere else.
export { xyz } from "https://unpkg.com/xyz-lib@v0.9.0/lib.ts";
```
-->
```ts
// "src/deps.ts" から新しい依存関係を追加し、他で使用します。
export { xyz } from "https://unpkg.com/xyz-lib@v0.9.0/lib.ts";
```

<!-- Then: -->
そして:

<!--
```shell
# Create/update the lock file "lock.json".
deno cache --lock=lock.json --lock-write src/deps.ts

# Include it when committing to source control.
git add -u lock.json
git commit -m "feat: Add support for xyz using xyz-lib"
git push
```
-->
```shell
# ロックファイル"lock.json"を作成/更新。
deno cache --lock=lock.json --lock-write src/deps.ts

# ソースコントロールにコミットするときに含める。
git add -u lock.json
git commit -m "feat: Add support for xyz using xyz-lib"
git push
```

<!-- Collaborator on another machine -- in a freshly cloned project tree: -->
他のマシンのコラボレーター -- clone下ばかりのプロジェクトツリーで:

<!--
```shell
# Download the project's dependencies into the machine's cache, integrity
# checking each resource.
deno cache --reload --lock=lock.json src/deps.ts

# Done! You can proceed safely.
deno test --allow-read src
```
-->
```shell
# プロジェクトの依存関係をキャッシュにダウンロードし、各リソースに整合性チェックをします。
deno cache --reload --lock=lock.json src/deps.ts

# 完了！安全に実行できます。
deno test --allow-read src
```

<!-- ### Runtime verification -->
### ランタイム検証

<!--
Like caching above, you can also use the `--lock=lock.json` option during use of
the `deno run` sub command, validating the integrity of any locked modules
during the run. Remember that this only validates against dependencies
previously added to the `lock.json` file. New dependencies will be cached but
not validated.
-->
上記のキャッシュのように、`deno run` サブコマンドを使用中に `--lock=lock.json` オプションを使って、実行中にロックされたモジュールの整合性を検証することが出来ます。これは以前に `lock.json` ファイルに追加された依存関係に対してのみ有効であることを覚えておいてください。新しい依存関係はキャッシュされますが、検証されません。

<!--
You can take this a step further as well by using the `--cached-only` flag to
require that remote dependencies are already cached.
-->
リモートの依存関係がすでにキャッシュされていることを要求するために `--cached-only` フラグを使うことで、更に一歩すすめることも出来ます。

```shell
deno run --lock=lock.json --cached-only mod.ts
```

<!--
This will fail if there are any dependencies in the dependency tree for mod.ts
which are not yet cached.
-->
mod.tsの依存関係ツリーがまだキャッシュされいない依存関係がある場合、これは失敗します。

<!-- TODO - Add detail on dynamic imports -->
