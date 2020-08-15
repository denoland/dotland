<!-- ## Code formatter -->
## コードフォーマッター

<!--
Deno ships with a built in code formatter that auto-formats TypeScript and
JavaScript code.
-->
DenoはTypeScriptとJavaScriptのコードを自動でフォーマットするコードフォーマッターをビルトインで備えています。

<!--
```shell
# format all JS/TS files in the current directory and subdirectories
deno fmt
# format specific files
deno fmt myfile1.ts myfile2.ts
# check if all the JS/TS files in the current directory and subdirectories are formatted
deno fmt --check
# format stdin and write to stdout
cat file.ts | deno fmt -
```
-->
```shell
# 現在のディレクトリとサブディレクトリのすべてのJS/TSファイルをフォーマット
deno fmt
# 特定のファイルをフォーマット
deno fmt myfile1.ts myfile2.ts
# 現在のディレクトリとサブディレクトリのすべてのJS/TSファイルがフォーマットされているかチェック
deno fmt --check
# 標準入力をフォーマットし標準出力に書き込む
cat file.ts | deno fmt -
```

<!-- Ignore formatting code by preceding it with a `// deno-fmt-ignore` comment: -->
`// deno-fmt-ignore` コメントをつけることでコードのフォーマットを無視することが出来ます:

```ts
// deno-fmt-ignore
export const identity = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
];
```

<!--
Or ignore an entire file by adding a `// deno-fmt-ignore-file` comment at the
top of the file.
-->
`// deno-fmt-ignore-file` コメントをファイルの最初につけることでファイルすべてを無視します。
