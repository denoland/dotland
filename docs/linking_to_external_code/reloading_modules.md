<!-- ## Reloading modules -->
## モジュールの再ロード

<!--
By default, a module in the cache will be reused without fetching or
re-compiling it. Sometimes this is not desirable and you can force deno to
refetch and recompile modules into the cache. You can invalidate your local
`DENO_DIR` cache using the `--reload` flag of the `deno cache` subcommand. It's
usage is described below:
-->
デフォルトではキャッシュ中のモジュールは新たに取得や再コンパイルされずに再利用されます。これが望ましくない場合はdenoに強制的にモジュールを再取得、再コンパイルさせキャッシュさせることが出来ます。`deno cache` サブコマンドの `--reload` フラグを使うことでローカルの `DENO_DIR` を無効にすることが出来ます。使い方は下記にあります:

<!-- ### To reload everything -->
### すべてを再ロード

```ts
deno cache --reload my_module.ts
```

<!-- ### To reload specific modules -->
### 特定のモジュールを再ロード

<!--
Sometimes we want to upgrade only some modules. You can control it by passing an
argument to a `--reload` flag.
-->
いくつかのモジュールだけ更新したいときがあります。そのためには `--reload` フラグに引数を渡すことでコントロール出来ます。

<!-- To reload all \$STD_VERSION standard modules -->
すべての\$STD_VERSION標準モジュールを再ロード

```ts
deno cache --reload=https://deno.land/std@$STD_VERSION my_module.ts
```

<!--
To reload specific modules (in this example - colors and file system copy) use a
comma to separate URLs
-->
特定のモジュール(この例ではcolorsとファイルシステムcopy)を再ロードするにはURLを分けるのにカンマを使ってください

```ts
deno cache --reload=https://deno.land/std@$STD_VERSION/fs/copy.ts,https://deno.land/std@$STD_VERSION/fmt/colors.ts my_module.ts
```

<!-- Should this be part of examples? -->
