<!-- ## Inspecting and revoking permissions -->
## パーミッションの検査と取り消し

<!--
> This program makes use of an unstable Deno feature. Learn more about
> [unstable features](../runtime/stability.md).
-->
> このプログラムは不安定版のDenoの機能を使います。詳しくは [unstable features](../runtime/stability.md) を参照してください。

<!--
Sometimes a program may want to revoke previously granted permissions. When a
program, at a later stage, needs those permissions, it will fail.
-->
プログラムは以前に許可されたパーミッションを取り携帯場合があります。プログラムが後の段階でこれらのパーミッションを必要とする場合、それは失敗します。

<!--
```ts
// lookup a permission
const status = await Deno.permissions.query({ name: "write" });
if (status.state !== "granted") {
  throw new Error("need write permission");
}

const log = await Deno.open("request.log", { write: true, append: true });

// revoke some permissions
await Deno.permissions.revoke({ name: "read" });
await Deno.permissions.revoke({ name: "write" });

// use the log file
const encoder = new TextEncoder();
await log.write(encoder.encode("hello\n"));

// this will fail.
await Deno.remove("request.log");
```
-->
```ts
// パーミッションをみる
const status = await Deno.permissions.query({ name: "write" });
if (status.state !== "granted") {
  throw new Error("need write permission");
}

const log = await Deno.open("request.log", { write: true, append: true });

// パーミッションを取り消す
await Deno.permissions.revoke({ name: "read" });
await Deno.permissions.revoke({ name: "write" });

// ログファイルを使う
const encoder = new TextEncoder();
await log.write(encoder.encode("hello\n"));

// これは失敗します。
await Deno.remove("request.log");
```
