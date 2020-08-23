<!-- ## Handle OS Signals -->
## OSシグナルの取り扱い

<!--
> This program makes use of an unstable Deno feature. Learn more about
> [unstable features](../runtime/stability.md).
-->
> このプログラムは不安定版のDenoの機能を使います。詳しくは [不安定版の機能](../runtime/stability.md) を参照してください。

[API Reference](https://doc.deno.land/https/raw.githubusercontent.com/denoland/deno/master/cli/dts/lib.deno.unstable.d.ts#Deno.signal)

<!-- You can use `Deno.signal()` function for handling OS signals: -->
OSシグナルを取り扱うために `Deno.signal()` を使うことが出来ます:

```ts
for await (const _ of Deno.signal(Deno.Signal.SIGINT)) {
  console.log("interrupted!");
}
```

<!-- `Deno.signal()` also works as a promise. -->
`Deno.signal()` はpromiseとしても動作します。

```ts
await Deno.signal(Deno.Signal.SIGINT);
console.log("interrupted!");
```

<!--
If you want to stop watching the signal, you can use `dispose()` method of the
signal object:
-->
シグナルの監視をやめたくなったら、シグナルオブジェクトの `dispose()` メソッドを使うことが出来ます:

```ts
const sig = Deno.signal(Deno.Signal.SIGINT);
setTimeout(() => {
  sig.dispose();
}, 5000);

for await (const _ of sig) {
  console.log("interrupted");
}
```

<!-- The above for-await loop exits after 5 seconds when `sig.dispose()` is called. -->
上記のfor-awaitループは `sig.dispose()` が呼ばれたあと5秒語に停止します。
