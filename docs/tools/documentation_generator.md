<!-- ## Documentation Generator -->
## ドキュメンテーションジェネレーター

<!--
`deno doc` followed by a list of one or more source files will print the JSDoc
documentation for each of the module's **exported** members. Currently, only
exports in the style `export <declaration>` and `export ... from ...` are
supported.
-->
`deno doc` のあとに1つ以上のソースファイルのリストをつけると、モジュールの**エクスポート**メンバーそれぞれのJSDocドキュメントが表示されます。現在は `export <declaration>` と `export ... from ...` の形式のエクスポートのみサポートします。

<!-- For example, given a file `add.ts` with the contents: -->
例えば、以下の内容の `add.ts` が与えられたとき:

<!--
```ts
/**
 * Adds x and y.
 * @param {number} x
 * @param {number} y
 * @returns {number} Sum of x and y
 */
export function add(x: number, y: number): number {
  return x + y;
}
```
-->
```ts
/**
 * Adds x and y.
 * @param {number} x
 * @param {number} y
 * @returns {number} x と y の加算
 */
export function add(x: number, y: number): number {
  return x + y;
}
```

<!-- Running the Deno `doc` command, prints the function's JSDoc comment to `stdout`: -->
Denoの `doc` コマンドを実行すると関数のJSDocコメントが `stdout` に表示されます:

```shell
deno doc add.ts
function add(x: number, y: number): number
  Adds x and y. @param {number} x @param {number} y @returns {number} Sum of x and y
```

<!--
Use the `--json` flag to output the documentation in JSON format. This JSON
format is consumed by the
[deno doc website](https://github.com/denoland/doc_website) and used to generate
module documentation.
-->
JSONフォーマットでドキュメントを出力するには `--json` フラグを使ってください。JSONフォーマットは [deno doc website](https://github.com/denoland/doc_website) で利用されモジュールドキュメントを生成するときに使われます。
