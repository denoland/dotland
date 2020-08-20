<!-- ## Script installer -->
## スクリプトインストーラー

<!-- Deno provides `deno install` to easily install and distribute executable code. -->
Denoは `deno install` で配布されている実行コードを簡単にインストールすることができます。

<!--
`deno install [OPTIONS...] [URL] [SCRIPT_ARGS...]` will install the script
available at `URL` under the name `EXE_NAME`.
-->
`deno install [OPTIONS...] [URL] [SCRIPT_ARGS...]` で、`EXE_NAME` の下の `URL` にある利用可能なスクリプトをインストールできます。

<!--
This command creates a thin, executable shell script which invokes `deno` using
the specified CLI flags and main module. It is placed in the installation root's
`bin` directory.
-->
このコマンドは、指定されたCLIフラッグとメインモジュールを使った `deno` を呼び出す薄い実行可能シェルスクリプトを作ります。それはインストールルートの `bin` ディレクトリの中に置かれます。

<!-- Example: -->
例:

```shell
$ deno install --allow-net --allow-read https://deno.land/std@$STD_VERSION/http/file_server.ts
[1/1] Compiling https://deno.land/std@$STD_VERSION/http/file_server.ts

✅ Successfully installed file_server.
/Users/deno/.deno/bin/file_server
```

<!--
To change the executable name, use `-n`/`--name`:
-->
実行可能ファイル名を変えるためには、`-n`/`--name` を使ってください:

```shell
deno install --allow-net --allow-read -n serve https://deno.land/std@$STD_VERSION/http/file_server.ts
```

<!--
The executable name is inferred by default:
-->
実行可能ファイル名はデフォルトによって推測されます:

<!--
- Attempt to take the file stem of the URL path. The above example would become
  'file_server'.
- If the file stem is something generic like 'main', 'mod', 'index' or 'cli',
  and the path has no parent, take the file name of the parent path. Otherwise
  settle with the generic name.
-->
- URLパスのファイルステムを取得しようとしました。上記の例では'file_server'となります。
- もしファイルステムが'main'、'mod'、'index'、'cli'のようなジェネリックで親のないパスであった場合、親のパスのファイルネームを取得します。そうでなければ、ジェネリック名を用います。

<!--
To change the installation root, use `--root`:
-->
インストールルートを変えるには `--root` を使います。

```shell
deno install --allow-net --allow-read --root /usr/local https://deno.land/std@$STD_VERSION/http/file_server.ts
```

<!--
The installation root is determined, in order of precedence:
-->
優先順位の順に、インストールルートは決定されます:

- `--root` option
- `DENO_INSTALL_ROOT` environment variable
- `$HOME/.deno`

<!--
These must be added to the path manually if required.
-->
これらは必要に応じて手動でパスを加える必要があります。

```shell
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
```

<!--
You must specify permissions that will be used to run the script at installation
time.
-->
インストール時にスクリプトを実行するためのパーミッションを指定しなければいけません。

```shell
deno install --allow-net --allow-read https://deno.land/std@$STD_VERSION/http/file_server.ts -p 8080
```

<!--
The above command creates an executable called `file_server` that runs with
network and read permissions and binds to port 8080.
-->
上記のコマンドは、ネットワークと読み取りパーミッションを設定し8080番のポートにバインドする `file_server` と呼ばれる実行可能ファイルを作っています。

<!--
For good practice, use the [`import.meta.main`](../examples/testing_if_main.md)
idiom to specify the entry point in an executable script.
-->
練習のために、実行可能スクリプトファイルの中のエントリーポイントを特定する [`import.meta.main`](../examples/testing_if_main.md) イディオムを使ってみましょう。

<!-- Example: -->
例:

<!-- dprint-ignore -->

<!--
```ts
// https://example.com/awesome/cli.ts
async function myAwesomeCli(): Promise<void> {
  -- snip --
}

if (import.meta.main) {
  myAwesomeCli();
}
```
-->
```ts
// https://example.com/awesome/cli.ts
async function myAwesomeCli(): Promise<void> {
  -- 省略 --
}

if (import.meta.main) {
  myAwesomeCli();
}
```

<!--
When you create an executable script make sure to let users know by adding an
example installation command to your repository:
-->
実行可能スクリプトファイルを作る時は、必ずあなたのリポジトリにインストールコマンドの例を追加して、ユーザに知らせましょう:

```shell
# Install using deno install

$ deno install -n awesome_cli https://example.com/awesome/cli.ts
```
