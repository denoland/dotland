<!-- ## TCP echo server -->
## TCP echo サーバー

<!--
This is an example of a server which accepts connections on port 8080, and
returns to the client anything it sends.
-->
これはポート8080でコネクションを受けクライアントから送られてきたものをそのまま返すサーバーの例です。

```ts
const listener = Deno.listen({ port: 8080 });
console.log("listening on 0.0.0.0:8080");
for await (const conn of listener) {
  Deno.copy(conn, conn);
}
```

<!-- When this program is started, it throws PermissionDenied error. -->
このプログラムがスタートするとき、プログラムはパーミッションが拒否されたエラーを投げるでしょう。

```shell
$ deno run https://deno.land/std@$STD_VERSION/examples/echo_server.ts
error: Uncaught PermissionDenied: network access to "0.0.0.0:8080", run again with the --allow-net flag
► $deno$/dispatch_json.ts:40:11
    at DenoError ($deno$/errors.ts:20:5)
    ...
```

<!--
For security reasons, Deno does not allow programs to access the network without
explicit permission. To allow accessing the network, use a command-line flag:
-->
セキュリティ上の理由でDenoは明示的なパーミッションがない限りプログラムはネットワークにアクセスされません。ネットワークアクセスを許可するにはコマンドラインフラグを使ってください:

```shell
deno run --allow-net https://deno.land/std@$STD_VERSION/examples/echo_server.ts
```

<!-- To test it, try sending data to it with netcat: -->
これをテストするにはnetcatでデータを送ってください:

```shell
$ nc localhost 8080
hello world
hello world
```

<!--
Like the `cat.ts` example, the `copy()` function here also does not make
unnecessary memory copies. It receives a packet from the kernel and sends back,
without further complexity.
-->
`cat.ts` の例と同じように `copy()` 関数は無駄なメモリコピーを作りません。この関数はカーネルからパケットが送られそして複雑なことをせずに送り返します。
