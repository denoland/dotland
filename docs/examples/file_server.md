<!-- ## File server -->
## ファイルサーバー

<!-- This one serves a local directory in HTTP. -->
これはローカルディレクトリをHTTPでサーブします。

```shell
deno install --allow-net --allow-read https://deno.land/std@$STD_VERSION/http/file_server.ts
```

<!-- Run it: -->
実行:

```shell
$ file_server .
Downloading https://deno.land/std@$STD_VERSION/http/file_server.ts...
[...]
HTTP server listening on http://0.0.0.0:4500/
```

<!-- And if you ever want to upgrade to the latest published version: -->
最新の公開バージョンに更新したい場合は:

```shell
file_server --reload
```
