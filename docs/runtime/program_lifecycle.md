<!-- ## Program lifecycle -->
## プログラムライフサイクル

<!--
Deno supports browser compatible lifecycle events: `load` and `unload`. You can
use these events to provide setup and cleanup code in your program.
-->
Denoはブラウザ互換のライフサイクルイベントをサポートしています: `load` と `unload`。プログラム中でコードの設定とクリーンアップを提供するためにこれらのイベントを使うことが出来ます。

<!--
Listeners for `load` events can be asynchronous and will be awaited. Listeners
for `unload` events need to be synchronous. Both events cannot be cancelled.
-->
`load` イベントのリスナーは async や await になることが出来ます。`unload` イベントのリスナーは同期的である必要があります。この両方のイベントは中断できません。

<!-- Example: -->
例:

**main.ts**

```ts
import "./imported.ts";

const handler = (e: Event): void => {
  console.log(`got ${e.type} event in event handler (main)`);
};

window.addEventListener("load", handler);

window.addEventListener("unload", handler);

window.onload = (e: Event): void => {
  console.log(`got ${e.type} event in onload function (main)`);
};

window.onunload = (e: Event): void => {
  console.log(`got ${e.type} event in onunload function (main)`);
};

console.log("log from main script");
```

**imported.ts**

```ts
const handler = (e: Event): void => {
  console.log(`got ${e.type} event in event handler (imported)`);
};

window.addEventListener("load", handler);
window.addEventListener("unload", handler);

window.onload = (e: Event): void => {
  console.log(`got ${e.type} event in onload function (imported)`);
};

window.onunload = (e: Event): void => {
  console.log(`got ${e.type} event in onunload function (imported)`);
};

console.log("log from imported script");
```

<!--
Note that you can use both `window.addEventListener` and
`window.onload`/`window.onunload` to define handlers for events. There is a
major difference between them, let's run the example:
-->
イベントハンドラーの定義のために `window.addEventListener` と `window.onload`/`window.onunload` の両方を使っていることに注意してください。この2つには重要な違いがあります。例のプログラムを実行してください:

```shell
$ deno run main.ts
log from imported script
log from main script
got load event in onload function (main)
got load event in event handler (imported)
got load event in event handler (main)
got unload event in onunload function (main)
got unload event in event handler (imported)
got unload event in event handler (main)
```

<!--
All listeners added using `window.addEventListener` were run, but
`window.onload` and `window.onunload` defined in `main.ts` overrode handlers
defined in `imported.ts`.
-->
`window.addEventListener` を使って追加されたすべてのリスナーは実行されました。しかし、`main.ts` で定義された `window.onload` と `window.onunload` は `imported.ts` で定義されたハンドラーに上書きされました。

<!--
In other words, you can register multiple `window.addEventListener` `"load"` or
`"unload"` events, but only the last loaded `window.onload` or `window.onunload`
events will be executed.
-->
別の言い方では複数の `window.addEventListener` `"load"` もしくは `"unload"` を登録できますが、最後にロードされる `window.onload` や `window.onunload` しか実行されません。
