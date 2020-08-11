<!-- ## Permissions -->
## パーミッション

<!--
Deno is secure by default. Therefore, unless you specifically enable it, a deno
module has no file, network, or environment access for example. Access to
security-sensitive areas or functions requires the use of permissions to be
granted to a deno process on the command line.
-->
Denoはデフォルトで安全です。そのため、明確に有効にしない限り、Denoモジュールはファイル、ネットワーク、環境などへのアクセスが有りません。セキュリティに関わるエリアや機能へのアクセスはコマンドラインでdenoのプロセスを生成するときにパーミッションの使用を要求します。

<!--
For the following example, `mod.ts` has been granted read-only access to the
file system. It cannot write to it, or perform any other security-sensitive
functions.
-->
次の例では、`mod.ts` がファイルシステムへ読み込みのみのアクセスを得ます。書き込みや他のセキュリティに関わる機能はできません。

```shell
deno run --allow-read mod.ts
```

<!-- ### Permissions list -->
### パーミッションリスト

<!-- The following permissions are available: -->
次のパーミッションが利用可能です:

<!--
- **-A, --allow-all** Allow all permissions. This disables all security.
- **--allow-env** Allow environment access for things like getting and setting
  of environment variables.
- **--allow-hrtime** Allow high-resolution time measurement. High-resolution
  time can be used in timing attacks and fingerprinting.
- **--allow-net=\<allow-net\>** Allow network access. You can specify an
  optional, comma-separated list of domains to provide an allow-list of allowed
  domains.
- **--allow-plugin** Allow loading plugins. Please note that --allow-plugin is
  an unstable feature.
- **--allow-read=\<allow-read\>** Allow file system read access. You can specify
  an optional, comma-separated list of directories or files to provide a
  allow-list of allowed file system access.
- **--allow-run** Allow running subprocesses. Be aware that subprocesses are not
  run in a sandbox and therefore do not have the same security restrictions as
  the deno process. Therefore, use with caution.
- **--allow-write=\<allow-write\>** Allow file system write access. You can
  specify an optional, comma-separated list of directories or files to provide a
  allow-list of allowed file system access.
-->
- **-A, --allow-all** すべてのパーミッションを許可。すべてのセキュリティを無効化。
- **--allow-env** 環境変数を取得したり設定したりするためのアクセスを許可。
- **--allow-hrtime** 高分解能時間計測を許可。高分解時間はタイミング攻撃やフィンガープリントに使われます。
- **--allow-net=\<allow-net\>** ネットワークアクセスを許可。任意で、カンマで区切られたリストを指定して、許可されたドメインの許可リストを提供することが出来ます。
- **--allow-plugin** プラグインのロードを許可。--allow-plugin は不安定な機能であることに注意してください。
- **--allow-read=\<allow-read\>** ファイルシステムの読み込みを許可。任意でディレクトリまたはファイルのカンマ区切りのリストを指定することで、ファイルシステムへの許可をするリストを提供する事ができます。
- **--allow-run** サブプロセスの実行を許可。サブプロセスはサンドボックスで実行されるわけではないことに注意してください、そのため、denoのプロセスと同じセキュリティ制限を持ちません。そのため注意してください。
- **--allow-write=\<allow-write\>** ファイルシステムへの書き込みを許可。任意でディレクトリまたはファイルのカンマ区切りのリストを指定することで、ファイルシステムへの許可をするリストを提供する事ができます。

### Permissions allow-list

Deno also allows you to control the granularity of some permissions with
allow-lists.

This example restricts file system access by allow-listing only the `/usr`
directory, however the execution fails as the process was attempting to access a
file in the `/etc` directory:

```shell
$ deno run --allow-read=/usr https://deno.land/std@$STD_VERSION/examples/cat.ts /etc/passwd
error: Uncaught PermissionDenied: read access to "/etc/passwd", run again with the --allow-read flag
► $deno$/dispatch_json.ts:40:11
    at DenoError ($deno$/errors.ts:20:5)
    ...
```

Try it out again with the correct permissions by allow-listing `/etc` instead:

```shell
deno run --allow-read=/etc https://deno.land/std@$STD_VERSION/examples/cat.ts /etc/passwd
```

`--allow-write` works the same as `--allow-read`.

### Network access:

_fetch.ts_:

```ts
const result = await fetch("https://deno.land/");
```

This is an example of how to allow-list hosts/urls:

```shell
deno run --allow-net=github.com,deno.land fetch.ts
```

If `fetch.ts` tries to establish network connections to any other domain, the
process will fail.

Allow net calls to any host/url:

```shell
deno run --allow-net fetch.ts
```
