<!-- # Import and Export Modules -->
# モジュールのインポートとエクスポート

<!--
Deno by default standardizes the way modules are imported in both JavaScript and
TypeScript. It follows the ECMAScript 6 `import/export` standard with one
caveat, the file type must be included at the end of import statement.
-->
DenoはデフォルトでJavaScriptとTypeScriptのモジュールのインポートを方法を照準化しています。これはECMAScript 6の `import/export` 標準に従っていますが、1つ注意点があります。

```js
import {
  add,
  multiply,
} from "./arithmetic.ts";
```

<!--
Dependencies are also imported directly, there is no package management
overhead. Local modules are imported in exactly the same way as remote modules.
As the examples show below, the same functionality can be produced in the same
way with local or remote modules.
-->
依存関係も直接インポートされます、パッケージマネージャのオーバーヘッドはありません。ローカルモジュールはリモートモジュールと全く同じ方法でインポートされます。下記の例のようにローカルモジュールでもリモートモジュールでも同じ方法で同じ機能を再現できます。

<!-- ## Local Import -->
## ローカルインポート

<!--
In this example the `add` and `multiply` functions are imported from a local
`arithmetic.ts` module.
-->
この例では、`add` と `multiply` 関数がローカルの `arithmetic.ts` モジュールからインストールされています。

**Command:** `deno run local.ts`

<!--
```ts
import { add, multiply } from "./arithmetic.ts";

function totalCost(outbound: number, inbound: number, tax: number): number {
  return multiply(add(outbound, inbound), tax);
}

console.log(totalCost(19, 31, 1.2));
console.log(totalCost(45, 27, 1.15));

/**
 * Output
 *
 * 60
 * 82.8
 */
```
-->
```ts
import { add, multiply } from "./arithmetic.ts";

function totalCost(outbound: number, inbound: number, tax: number): number {
  return multiply(add(outbound, inbound), tax);
}

console.log(totalCost(19, 31, 1.2));
console.log(totalCost(45, 27, 1.15));

/**
 * 出力
 *
 * 60
 * 82.8
 */
```

<!-- ## Export -->
## エクスポート

<!--
In the example above the `add` and `multiply` functions are imported from a
locally stored arithmetic module. To make this possible the functions stored in
the arithmetic module must be exported.
-->
上記の `add` と `multiply` 関数の例はローカルからインポートされarithmeticモジュールに保存されました。これを可能にするためにはarithmeticモジュールに保存されている関数はエクスポートする必要があります。

<!--
To do this just add the keyword `export` to the beginning of the function
signature as is shown below.
-->
このためには下記の例のように関数のシグニチャのはじめに `export` を追加するだけです。

```ts
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}
```

<!--
All functions, classes, constants and variables which need to be accessible
inside external modules must be exported. Either by prepending them with the
`export` keyword or including them in an export statement at the bottom of the
file.
-->
外部モジュールの内部からアクセスする必要があるすべての関数、クラス、定数そして変数はエクスポートされる必要があります。このために `export` をつけるかファイルの最後のエクスポート文に含める必要があります。

<!--
To find out more on ECMAScript Export functionality please read the
[MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).
-->
ECMAScriptのエクスポート機能のより詳しい情報は [MDN ドキュメント](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/export) を読んでください。

<!-- ## Remote Import -->
## リモートインポート

<!--
In the local import example above an `add` and `multiply` method are imported
from a locally stored arithmetic module. The same functionality can be created
by importing `add` and `multiply` methods from a remote module too.
-->
上記の `add` と `multiply` メソッドのインポートの例はローカルに本尊されたarithmeticモジュールからインポートされました。リモートモジュールから `add` と `multiply` メソッドをインポートしても同じ機能を作ることが出来ます。

<!--
In this case the Ramda module is referenced, including the version number. Also
note a JavaScript module is imported directly into a TypeSript module, Deno has
no problem handling this.
-->
この例ではRamdaモジュールがバージョン付きで参照されています。また、JavaScriptモジュールがTypeScriptモジュールに直接インポートされていることに注意してください。Denoはこれを問題なく扱います。

**Command:** `deno run ./remote.ts`

<!--
```ts
import {
  add,
  multiply,
} from "https://x.nest.land/ramda@0.27.0/source/index.js";

function totalCost(outbound: number, inbound: number, tax: number): number {
  return multiply(add(outbound, inbound), tax);
}

console.log(totalCost(19, 31, 1.2));
console.log(totalCost(45, 27, 1.15));

/**
 * Output
 *
 * 60
 * 82.8
 */
```
-->
```ts
import {
  add,
  multiply,
} from "https://x.nest.land/ramda@0.27.0/source/index.js";

function totalCost(outbound: number, inbound: number, tax: number): number {
  return multiply(add(outbound, inbound), tax);
}

console.log(totalCost(19, 31, 1.2));
console.log(totalCost(45, 27, 1.15));

/**
 * 出力
 *
 * 60
 * 82.8
 */
```
