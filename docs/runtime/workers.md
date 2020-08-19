<!-- ## Workers -->
## ワーカー

<!--
Deno supports
[`Web Worker API`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker).
-->
Denoは [`Web Worker API`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) をサポートします。

<!--
Workers can be used to run code on multiple threads. Each instance of `Worker`
is run on a separate thread, dedicated only to that worker.
-->
ワーカーは複数スレッドでコードを実行する時に使われます。それぞれの `Worker` インスタンスはワーカーそれぞれのワーカー専有の別々のスレッドで実行されます。

<!--
Currently Deno supports only `module` type workers; thus it's essential to pass
the `type: "module"` option when creating a new worker.
-->
現在、Denoは `module` タイプのワーカーのみサポートしています; そのため、新しいワーカーを作成するときに `type: "module"` オプションを指定します。

<!--
Relative module specifiers are
[not supported](https://github.com/denoland/deno/issues/5216) at the moment. You
can instead use the `URL` contructor and `import.meta.url` to easily create a
specifier for some nearby script.
-->
相対的なモジュールは現在 [サポートされていません](https://github.com/denoland/deno/issues/5216)。代わりに `URL` コンストラクタと `import.meta.url` を使って簡単にスクリプトの指定子を作ることが出来ます。

<!--
```ts
// Good
new Worker(new URL("worker.js", import.meta.url).href, { type: "module" });

// Bad
new Worker(new URL("worker.js", import.meta.url).href);
new Worker(new URL("worker.js", import.meta.url).href, { type: "classic" });
new Worker("./worker.js", { type: "module" });
```
-->
```ts
// 良い例
new Worker(new URL("worker.js", import.meta.url).href, { type: "module" });

// 悪い例
new Worker(new URL("worker.js", import.meta.url).href);
new Worker(new URL("worker.js", import.meta.url).href, { type: "classic" });
new Worker("./worker.js", { type: "module" });
```

<!-- ### Permissions -->
### パーミッション

<!--
Creating a new `Worker` instance is similar to a dynamic import; therefore Deno
requires appropriate permission for this action.
-->
新しい `Worker` インスタンスの作成はダイナミックインポートと似ています; そのためDenoはこのアクションに適切なパーミッションを要求します。

<!-- For workers using local modules; `--allow-read` permission is required: -->
ローカルモジュールを使うワーカーには `--allow-read` パーミッションが必要です:

**main.ts**

```ts
new Worker(new URL("worker.ts", import.meta.url).href, { type: "module" });
```

**worker.ts**

```ts
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
error: Uncaught PermissionDenied: read access to "./worker.ts", run again with the --allow-read flag

$ deno run --allow-read main.ts
hello world
```

<!-- For workers using remote modules; `--allow-net` permission is required: -->
リモートモジュールを使うワーカーには `--allow-net` パーミッションが必要です:

**main.ts**

```ts
new Worker("https://example.com/worker.ts", { type: "module" });
```

**worker.ts** (at https[]()://example.com/worker.ts)

```ts
console.log("hello world");
self.close();
```

```shell
$ deno run main.ts
error: Uncaught PermissionDenied: net access to "https://example.com/worker.ts", run again with the --allow-net flag

$ deno run --allow-net main.ts
hello world
```

<!-- ### Using Deno in worker -->
### ワーカー内でのDenoの使用

<!--
> This is an unstable Deno feature. Learn more about
> [unstable features](./stability.md).
-->
> これは不安定版のDenoの機能です。詳しくは [不安定版の機能](./stability.md) を見てください。

<!-- By default the `Deno` namespace is not available in worker scope. -->
デフォルトでは `Deno` 名前空間はワーカースコープ内で有効ではありません。

<!-- To add the `Deno` namespace pass `deno: true` option when creating new worker: -->
`Deno` 名前空間を追加するには新しいワーカーを作成するときに `deno: true` オプションを渡してください:

**main.js**

```ts
const worker = new Worker(new URL("worker.js", import.meta.url).href, {
  type: "module",
  deno: true,
});
worker.postMessage({ filename: "./log.txt" });
```

**worker.js**

```ts
self.onmessage = async (e) => {
  const { filename } = e.data;
  const text = await Deno.readTextFile(filename);
  console.log(text);
  self.close();
};
```

**log.txt**

```
hello world
```

```shell
$ deno run --allow-read --unstable main.js
hello world
```

<!--
When the `Deno` namespace is available in worker scope, the worker inherits its
parent process' permissions (the ones specified using `--allow-*` flags).
-->
`Deno` 名前空間がワーカースコープ内で有効のとき、ワーカーは親プロセスのパーミッションを継承します(`--allow-*` フラグで指定したものです)。

<!-- We intend to make permissions configurable for workers. -->
ワーカーのパーミッションを設定可能にする予定です。
