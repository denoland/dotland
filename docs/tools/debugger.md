<!-- ## Debugger -->
## デバッガー

<!-- Deno supports the [V8 Inspector Protocol](https://v8.dev/docs/inspector). -->
Denoは [V8 Inspector Protocol](https://v8.dev/docs/inspector) をサポートしています。

<!--
It's possible to debug Deno programs using Chrome Devtools or other clients that
support the protocol (eg. VSCode).
-->
DenoプログラムをChrome Devtoolsやプロトコルをサポートしている他のクライアント(VSCodeなど)を使ってデバッグすることが可能です。

<!--
To activate debugging capabilities run Deno with the `--inspect` or
`--inspect-brk` flags.
-->
デバッグ機能を有効にするには `--inspect` もしくは
`--inspect-brk` フラグを指定してDenoを実行してください。

<!--
The `--inspect` flag allows attaching the debugger at any point in time, while
`--inspect-brk` will wait for the debugger to attach and will pause execution on
the first line of code.
-->
`--inspect` フラグは任意の時点でデバッガをつけることを可能にし、`--inspect-brk` はデバッガが付くのを待ち個ーd－の最初の行で実行を一時停止します。

### Chrome Devtools

<!--
Let's try debugging a program using Chrome Devtools. For this, we'll use
[file_server.ts](https://deno.land/std@$STD_VERSION/http/file_server.ts) from
`std`, a static file server.
-->
Chrome Devtoolsを使ってプログラムをデバッグしてみましょう。静的ファイルサーバーである `std` の [file_server.ts](https://deno.land/std@$STD_VERSION/http/file_server.ts) を使います。

<!-- Use the `--inspect-brk` flag to break execution on the first line: -->
最初の行に実行を中断するための `--inspect-brk` フラグを使ってください。

```shell
$ deno run --inspect-brk --allow-read --allow-net https://deno.land/std@$STD_VERSION/http/file_server.ts
Debugger listening on ws://127.0.0.1:9229/ws/1e82c406-85a9-44ab-86b6-7341583480b1
Download https://deno.land/std@$STD_VERSION/http/file_server.ts
Compile https://deno.land/std@$STD_VERSION/http/file_server.ts
...
```

<!-- Open `chrome://inspect` and click `Inspect` next to target: -->
`chrome://inspect` を開きターゲットの次の `Inspect` をクリックしてください

![chrome://inspect](../images/debugger1.jpg)

<!-- It might take a few seconds after opening the Devtools to load all modules. -->
devtoolsを開いて全てのモジュールを読み込むのには数秒かかるかもしれません。

![Devtools opened](../images/debugger2.jpg)

<!--
You might notice that Devtools paused execution on the first line of
`_constants.ts` instead of `file_server.ts`. This is expected behavior and is
caused by the way ES modules are evaluated by V8 (`_constants.ts` is left-most,
bottom-most dependency of `file_server.ts` so it is evaluated first).
-->
Devtoolsが `file_server.ts` の代わりに `_constants.ts` の最初の行で実行を一時停止したことに気づくかもしれません。これは期待される動作であり、ESモジュールがV8によって評価される方法に起因しています(`_constants.ts` は `file_server.ts` の最左、最下の依存関係なので最初に評価されます)。

<!--
At this point all source code is available in the Devtools, so let's open up
`file_server.ts` and add a breakpoint there; go to "Sources" pane and expand the
tree:
-->
Devtoolsでソースコードが利用可能になったら、`file_server.ts` を開いてブレークポイントを加えましょう; `Sources` ペインに行ってツリーを展開してください:

![Open file_server.ts](../images/debugger3.jpg)

<!--
_Looking closely you'll find duplicate entries for each file; one written
regularly and one in italics. The former is compiled source file (so in the case
of `.ts` files it will be emitted JavaScript source), while the latter is a
source map for the file._
-->
_詳しく見てみると、それぞれのファイルの重複したエントリを見つけることが出来るでしょう; 一つはレギュラーで書かれていて一つはイタリックで書かれています。前者はコンパイルされたソースファイルです(だから、`.ts` ファイルの場合エミットされたJavaScriptソースです)、後者はこのファイルのソースマップです。_

<!-- Next, add a breakpoint in the `listenAndServe` method: -->
次に、`listenAndServe` メソッドにブレークポイントを追加してください:

![Break in file_server.ts](../images/debugger4.jpg)

<!--
As soon as we've added the breakpoint Devtools automatically opened up the
source map file, which allows us step through the actual source code that
includes types.
-->
ブレークポイントを追加した瞬間Devtoolsは自動的に型を含む本当のソースコードに踏み込ましてくれるソースマップファイルを開きます。

<!--
Now that we have our breakpoints set, we can resume the execution of our script
so that we might inspect an incoming request. Hit the Resume script execution
button to do so. You might even need to hit it twice!
-->
ブレークポイントがセットされたので、入ってくるリクエストを解析するためにスクリプトの実行を再開できます。Resume script executionbuttonを押してください。2回押す必要があるでしょう。

<!--
Once our script is running again, let's send a request and inspect it in
Devtools:
-->
スクリプトの実行が再開したら、リクエストを送ってDevtoolsで解析してみましょう:

```
$ curl http://0.0.0.0:4500/
```

![Break in request handling](../images/debugger5.jpg)

<!--
At this point we can introspect the contents of the request and go step-by-step
to debug the code.
-->
この時点でリクエストの内容を見ることが出来、ステップバイステップでコードをデバッグすることが出来ます。

### VSCode

<!-- Deno can be debugged using VSCode. -->
DenoはVSCodeを使ってもデバッグできます。

<!--
Official support via the plugin is being worked on -
https://github.com/denoland/vscode_deno/issues/12
-->
プラグインでの公式サポートは https://github.com/denoland/vscode_deno/issues/12 で動いています。

<!--
We can still attach the debugger by manually providing a
[`launch.json`](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations)
config:
-->
[`launch.json`](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations) を提供することでデバッガーを手動でつけることも出来ます。config:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Deno",
      "type": "pwa-node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "deno",
      "runtimeArgs": ["run", "--inspect-brk", "-A", "${file}"],
      "attachSimplePort": 9229
    }
  ]
}
```

<!--
**NOTE**: This uses the file you have open as the entry point; replace `${file}`
with a script name if you want a fixed entry point.
-->
**注意**: 開いているファイルをエントリーポイントとして使用します; 固定されたエントリーポイントがほしいなら、`${file}` スクリプト名で置き換えてください。

<!-- Let's try out debugging a local source file. Create `server.ts`: -->
論理ソースファイルをデバッグしてみましょう。`server.ts` を作ってください:

```ts
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";
const server = serve({ port: 8000 });
console.log("http://localhost:8000/");

for await (const req of server) {
  req.respond({ body: "Hello World\n" });
}
```

<!-- Then we can set a breakpoint, and run the created configuration: -->
そして、ブレークポイントをセットし作成されたコンフィグレーションを実行してください:

![VSCode debugger](../images/debugger7.jpg)

### JetBrains IDEs

<!--
You can debug Deno using your JetBrains IDE by right-clicking the file you want
to debug and selecting the `Debug 'Deno: <file name>'` option. This will create
a run/debug configuration with no permission flags set. To configure these flags
edit the run/debug configuration and modify the `Arguments` field with the
required flags.
-->
JetBrains IDEを使ってDenoをデバッグすることが出来ます。デバッグしたいファイルを右クリックして`Debug 'Deno: <file name>'` オプションを選択してください。パーミッションフラグの設定なしに実行/デバッグのコンフィグレーションを作ります。これらのフラグを設定するにはrun/debug configurationを編集し `Arguments` フィールドを必要なフラグで変更してください。

<!-- ### Other -->
### その他

<!--
Any client that implements the Devtools protocol should be able to connect to a
Deno process.
-->
Devtoolsプロトコルを実装している全てのクライアントはDenoプロセスと通信できるはずです。

<!-- ### Limitations -->
### 制限

<!--
Devtools support is still immature. There is some functionality that is known to
be missing or buggy:
-->
Devtoolsサポートはまだ未熟です。一部の機能はなかったりバグが多いです。

<!--
- autocomplete in Devtools' console causes the Deno process to exit
- profiling and memory dumps might not work correctly
-->
- Devtoolsでの自動補完はDenoプロセスの終了を引き起こします
- プロファイリングとメモリダンプは正しく動かない可能性があります
