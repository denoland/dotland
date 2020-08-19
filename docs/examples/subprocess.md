<!-- ## Run subprocess -->
## サブプロセスの実行

[API Reference](https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts#Deno.run)

<!-- Example: -->
例:

<!--
```ts
// create subprocess
const p = Deno.run({
  cmd: ["echo", "hello"],
});

// await its completion
await p.status();
```
-->
```ts
// サブプロセスの作成
const p = Deno.run({
  cmd: ["echo", "hello"],
});

// 完了を待つ
await p.status();
```

<!-- Run it: -->
実行:

```shell
$ deno run --allow-run ./subprocess_simple.ts
hello
```

<!--
Here a function is assigned to `window.onload`. This function is called after
the main script is loaded. This is the same as
[onload](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload)
of the browsers, and it can be used as the main entrypoint.
-->
関数は `window.onload` に代入されます。この関数はmainスクリプトがロードされたあとに呼ばれます。これはブラウザの [onload](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload) と同じで、mainエントリーポイントとして使うことが出来ます。

<!--
By default when you use `Deno.run()` subprocess inherits `stdin`, `stdout` and
`stderr` of parent process. If you want to communicate with started subprocess
you can use `"piped"` option.
-->
デフォルトでは `Deno.run()` サブプロセスを使うとき親プロセスの `stdin`、`stdout` そして `stderr` を継承します。もし開始されたサブプロセスと通信したいときは `"piped"` オプションを使うことが出来ます。

```ts
const fileNames = Deno.args;

const p = Deno.run({
  cmd: [
    "deno",
    "run",
    "--allow-read",
    "https://deno.land/std@$STD_VERSION/examples/cat.ts",
    ...fileNames,
  ],
  stdout: "piped",
  stderr: "piped",
});

const { code } = await p.status();

if (code === 0) {
  const rawOutput = await p.output();
  await Deno.stdout.write(rawOutput);
} else {
  const rawError = await p.stderrOutput();
  const errorString = new TextDecoder().decode(rawError);
  console.log(errorString);
}

Deno.exit(code);
```

<!-- When you run it: -->
実行時:

```shell
$ deno run --allow-run ./subprocess.ts <somefile>
[file content]

$ deno run --allow-run ./subprocess.ts non_existent_file.md

Uncaught NotFound: No such file or directory (os error 2)
    at DenoError (deno/js/errors.ts:22:5)
    at maybeError (deno/js/errors.ts:41:12)
    at handleAsyncMsgFromRust (deno/js/dispatch.ts:27:17)
```
