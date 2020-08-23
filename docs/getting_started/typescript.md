<!-- ## Using TypeScript -->
## TypeScriptの使用

<!-- TODO(lucacasonato): text on 'just import .ts' -->

<!--
Deno supports both JavaScript and TypeScript as first class languages at
runtime. This means it requires fully qualified module names, including the
extension (or a server providing the correct media type). In addition, Deno has
no "magical" module resolution. Instead, imported modules are specified as files
(including extensions) or fully qualified URL imports. Typescript modules can be
directly imported. E.g.
-->
DenoはJavaScriptとTypeScriptの両方をランタイムの主要言語としてサポートしています。つまり、完全なモジュール名と拡張子(もしくはサーバーが正しいメディアタイプを提供)を要求します。加えて、Denoは"魔法の"モジュール解決をしません。代わりに指定されたファイル(拡張子込み)か完全なURLでモジュールをインポートします。TypeScriptモジュールは直接インポートすることが出来ます。例えば、

```
import { Response } from "https://deno.land/std@$STD_VERSION/http/server.ts";
import { queue } from "./collections.ts";
```

<!-- ### `--no-check` option -->
### `--no-check` オプション

<!--
When using `deno run`, `deno test`, `deno cache`, `deno info`, or `deno bundle`
you can specify the `--no-check` flag to disable TypeScript type checking. This
can significantly reduce the time that program startup takes. This can be very
useful when type checking is provided by your editor and you want startup time
to be as fast as possible (for example when restarting the program automatically
with a file watcher).
-->
`deno run`、`deno test`、`deno cache`、`deno info` もしくは `deno bundle` を使う時 `--no-check` を使うことでTypeScriptの型チェックを無効にすることが出来ます。これはプログラムのスタートアップ処理の時間をかなり減らすことが出来ます。エディターが型チェックを提供していたり可能化限りスタートアップの時間を早くしたいとき(例えばファイル監視システムと連動してプログラムを自動再起動する時)にかなり便利です。

<!--
Because `--no-check` does not do TypeScript type checking we can not
automatically remove type only imports and exports as this would require type
information. For this purpose TypeScript provides the
[`import type` and `export type` syntax](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-exports).
To export a type in a different file use
`export type { AnInterface } from "./mod.ts";`. To import a type use
`import type { AnInterface } from "./mod.ts";`. You can check that you are using
`import type` and `export type` where necessary by setting the `isolatedModules`
TypeScript compiler option to `true`. You can see an example `tsconfig.json`
with this option
[in the standard library](https://github.com/denoland/deno/blob/master/std/tsconfig_test.json).
-->
`--no-check` はTypeScriptの型チェックをしないため、自動的に型情報のために必要な型のみのインポートとエクスポートの削除しません。このため、TypeScriptは [`import type` and `export type` syntax](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-exports) を提供しています。
別ファイルの型情報をエクスポートするには `export type { AnInterface } from "./mod.ts";` 使ってください。インポートするには `import type { AnInterface } from "./mod.ts";` を使ってください。`isolatedModules` TypeScriptのコンパイラオプションを `true` にセットすることで `import type` と `export type` を使っているかを確認することが出来ます。このオプションを有効にした `tsconfig.json` の例は [in the standard library](https://github.com/denoland/deno/blob/master/std/tsconfig_test.json) にあります。

<!--
Because there is no type information when using `--no-check`, `const enum` is
not supported because it is type-directed. `--no-check` also does not support
the legacy `import =` and `export =` syntax.
-->
`--no-check` を使っている時、型情報がないため、 `const enum` は型であるためサポートされません。`--no-check` はかつての `import =` と `export =` もサポートしません。

<!-- ### Using external type definitions -->
### 外部の型定義の使用

<!--
The out of the box TypeScript compiler though relies on both extension-less
modules and the Node.js module resolution logic to apply types to JavaScript
modules.
-->
初期設定のTypeScriptコンパイラはJavaScriptモジュールの型に合わせるため拡張子なしのモジュールとNode.jsモジュール解決ロジックの両方を頼ります。

<!--
In order to bridge this gap, Deno supports three ways of referencing type
definition files without having to resort to "magic" resolution.
-->
このモジュールの差を埋めるため、Denoは"魔法"解決を使わずに3つの参照型定義をサポートしています。

<!-- #### Compiler hint -->
#### コンパイラヒント

<!--
If you are importing a JavaScript module, and you know where the type definition
for that module is located, you can specify the type definition at import. This
takes the form of a compiler hint. Compiler hints inform Deno the location of
`.d.ts` files and the JavaScript code that is imported that they relate to. The
hint is `@deno-types` and when specified the value will be used in the compiler
instead of the JavaScript module. For example, if you had `foo.js`, but you know
that alongside of it was `foo.d.ts` which was the types for the file, the code
would look like this:
-->
もしJavaScriptモジュールをインポートしていてそのモジュールの型定義がどこにあるか知っているなら、インポートの際に型定義を指定することが出来ます。これはコンパイラのヒントの形をとっています。コンパイラヒントは `.d.ts` ファイルの場所とそれに関連してインポートされたJavaScriptコードをDenoに通知します。ヒントは `@deno-types` で指定された値はJavaScriptモジュールの代わりにコンパイラで使われます。例えば、`foo.js` があったとして、そのファイルの型である `foo.d.ts` がそれと一緒にあったとすると、以下のようなコードになります:

```ts
// @deno-types="./foo.d.ts"
import * as foo from "./foo.js";
```

<!--
The value follows the same resolution logic as importing a module, meaning the
file needs to have an extension and is relative to the current module. Remote
specifiers are also allowed.
-->
この値はモジュールのインポートと同じ解決ロジックに従います。つまり、ファイルには拡張子が必要で、現在のモジュールから相対的であるということです。リモート指定も許可されています。

<!--
The hint affects the next `import` statement (or `export ... from` statement)
where the value of the `@deno-types` will be substituted at compile time instead
of the specified module. Like in the above example, the Deno compiler will load
`./foo.d.ts` instead of `./foo.js`. Deno will still load `./foo.js` when it runs
the program.
-->
ヒントは次の `import` 文(もしくは `export ... from` 文)に影響を与え、コンパイル時に指定されたモジュールの代わりに `@deno-types` の値が代入されます。上記の例のようにDenoコンパイラは `./foo.js` の代わりに `./foo.d.ts` をロードします。Denoはプログラムを実行しても `./foo.js` を読み込みます。

<!-- #### Triple-slash reference directive in JavaScript files -->
#### JavaScriptファイル中のトリプルスラッシュリファレンスディレクティブ

<!--
If you are hosting modules which you want to be consumed by Deno, and you want
to inform Deno about the location of the type definitions, you can utilize a
triple-slash directive in the actual code. For example, if you have a JavaScript
module and you would like to provide Deno with the location of the type
definition which happens to be alongside that file, your JavaScript module named
`foo.js` might look like this:
-->
Denoに使用してほしいモジュールをホスティングていてDenoに型定義の場所を教えたい場合は、コード中にトリプルスラッシュディレクティブを利用することが出来ます。例えば、JavaScriptモジュールを持っていてDenoにそのファイルと一緒に型定義の場所を提供したい場合 `foo.js` という名前のJavaScriptモジュールは下記のようになります:

```js
/// <reference types="./foo.d.ts" />
export const foo = "foo";
```

<!--
Deno will see this, and the compiler will use `foo.d.ts` when type checking the
file, though `foo.js` will be loaded at runtime. The resolution of the value of
the directive follows the same resolution logic as importing a module, meaning
the file needs to have an extension and is relative to the current file. Remote
specifiers are also allowed.
-->
Denoはこれを見てコンパイラはファイルを型チェックする際 `foo.d.ts` を使いますが、`foo.js` がランタイムにロードされます。ディレクティブの値の解決はモジュールのインポートと同じ解決ロジックに板がいます。つまり、ファイルには拡張子が必要で現在のファイルから相対的でないといけません。リモート指定子も許可されています。

<!-- #### X-TypeScript-Types custom header -->
#### X-TypeScript-Types カスタムヘッダー

<!--
If you are hosting modules which you want to be consumed by Deno, and you want
to inform Deno the location of the type definitions, you can use a custom HTTP
header of `X-TypeScript-Types` to inform Deno of the location of that file.
-->
Denoに使用してほしいモジュールをホスティングていてDenoに型定義の場所を教えたい場合は、カスタムHTTPヘッダー `X-TypeScript-Types` を使ってDenoにファイルの場所を教えることが出来ます。

<!--
The header works in the same way as the triple-slash reference mentioned above,
it just means that the content of the JavaScript file itself does not need to be
modified, and the location of the type definitions can be determined by the
server itself.
-->
ヘッダーは上記のトリプルスラッシュリファレンスと同じように動き、JavaScriptファイルの内容を変更する必要がなく、型定義の場所はサーバー自身で決定できるということを意味しています。

<!-- **Not all type definitions are supported.** -->
**すべての型定義がサポートされているわけではありません**

<!--
Deno will use the compiler hint to load the indicated `.d.ts` files, but some
`.d.ts` files contain unsupported features. Specifically, some `.d.ts` files
expect to be able to load or reference type definitions from other packages
using the module resolution logic. For example a type reference directive to
include `node`, expecting to resolve to some path like
`./node_modules/@types/node/index.d.ts`. Since this depends on non-relative
"magical" resolution, Deno cannot resolve this.
-->
Denoはコンパイラヒントを使って指定された `.d.ts` ファイルを読み込みますが、一部の `.d.ts` ファイルはサポートされていない機能を含んでいます。具体的には一部の `.d.ts` ファイルはモジュール解決ロジックを使用して他のパッケージから型定義をロードしたり参照したり出来ると期待しています。例えば、`node` を含むための型リファレンスディレクティブは `./node_modules/@types/node/index.d.ts` のようなパスを解決できると期待しています。これは非相対的で"魔法"の解決に依存していて、Denoはこれを解決できません。

<!-- **Why not use the triple-slash type reference in TypeScript files?** -->
**なぜTypeScriptファイル中でトリプルスラッシュ型リファレンスを使わないのですか？**

<!--
The TypeScript compiler supports triple-slash directives, including a type
reference directive. If Deno used this, it would interfere with the behavior of
the TypeScript compiler. Deno only looks for the directive in JavaScript (and
JSX) files.
-->
TypeScriptコンパイラは型リファレンスディレクティブを含むトリプルスラッシュディレクティブをサポートしています。もしDenoがこれを使えば、TypeScriptコンパイラの動作を妨げることになります。DenoはJavaScript(とJSX)ファイル内のディレクティブのみ探します。

<!-- ### Custom TypeScript Compiler Options -->
### カスタムTypeScriptコンパイラオプション

<!--
In the Deno ecosystem, all strict flags are enabled in order to comply with
TypeScript's ideal of being `strict` by default. However, in order to provide a
way to support customization a configuration file such as `tsconfig.json` might
be provided to Deno on program execution.
-->
Denoエコシステムでは、TypeScriptの理想である `strict` をデフォルトを満たすため全てのstrictフラグが有効になっています。しかし、カスタマイズをサポートする方法を提供するためにプログラム実行時に `tsconfig.json` のような設定ファイルをDenoに提供することがあります。

<!--
You need to explicitly tell Deno where to look for this configuration by setting
the `-c` (or `--config`) argument when executing your application.
-->
アプリケーションの実行時に `-c` (もしくは `--config`)引数を設定することでDenoにどこにこの設定ファイルがあるかを明示的に伝える必要があります。

```shell
deno run -c tsconfig.json mod.ts
```

<!-- Following are the currently allowed settings and their default values in Deno: -->
Denoで現在許可されている設定とそのデフォルト値は次のとおりです:

```json
{
  "compilerOptions": {
    "allowJs": false,
    "allowUmdGlobalAccess": false,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "alwaysStrict": true,
    "assumeChangesOnlyAffectDirectDependencies": false,
    "checkJs": false,
    "disableSizeLimit": false,
    "generateCpuProfile": "profile.cpuprofile",
    "jsx": "react",
    "jsxFactory": "React.createElement",
    "lib": [],
    "noFallthroughCasesInSwitch": false,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitUseStrict": false,
    "noStrictGenericChecks": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "preserveConstEnums": false,
    "removeComments": false,
    "resolveJsonModule": true,
    "strict": true,
    "strictBindCallApply": true,
    "strictFunctionTypes": true,
    "strictNullChecks": true,
    "strictPropertyInitialization": true,
    "suppressExcessPropertyErrors": false,
    "suppressImplicitAnyIndexErrors": false,
    "useDefineForClassFields": false
  }
}
```

<!--
For documentation on allowed values and use cases please visit the
[typescript docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html).
-->
許可された値とその使いみちについてのドキュメントは [typescript docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html) を参照してください。

<!--
**Note**: Any options not listed above are either not supported by Deno or are
listed as deprecated/experimental in the TypeScript documentation.
-->
**注意**: 上記でリストされていないどのオプションもDenoでサポートされていないかTypeScriptドキュメントで非推奨/実験的として記載されています。
