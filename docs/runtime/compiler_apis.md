<!-- ## Compiler APIs -->
## コンパイラAPI

<!--
> This API is unstable. Learn more about
> [unstable features](./stability.md).
-->
> このAPIは不安定です。詳しくは [unstable features](./stability.md) を参照してください。

<!--
Deno supports runtime access to the built-in TypeScript compiler. There are
three methods in the `Deno` namespace that provide this access.
-->
DenoはビルトインTypeScriptコンパイラへのランタイムアクセスをサポートします。このアクセスを提供するために `Deno` 名前空間に3つのメソッドがあります。

### `Deno.compile()`

<!--
This works similar to `deno cache` in that it can fetch and cache the code,
compile it, but not run it. It takes up to three arguments, the `rootName`,
optionally `sources`, and optionally `options`. The `rootName` is the root
module which will be used to generate the resulting program. This is like the
module name you would pass on the command line in
`deno run --reload example.ts`. The `sources` is a hash where the key is the
fully qualified module name, and the value is the text source of the module. If
`sources` is passed, Deno will resolve all the modules from within that hash and
not attempt to resolve them outside of Deno. If `sources` are not provided, Deno
will resolve modules as if the root module had been passed on the command line.
Deno will also cache any of these resources. All resolved resources are treated
as dynamic imports and require read or net permissions depending on if they're
local or remote. The `options` argument is a set of options of type
`Deno.CompilerOptions`, which is a subset of the TypeScript compiler options
containing the ones supported by Deno.
-->
これは `deno cache` と同じように動きます、コードを取得、キャッシュして、コンパイルしますが実行はしません。`rootName`、任意で `sources`、任意で `options` の3つの引数を取ります。`rootName` はランタイムプログラムを生成するときに使われるルートモジュールです。これは `deno run --reload example.ts` でコマンドラインで渡すのモジュール名と同じです。`sources` はハッシュであり、キーは完全なモジュール名で値はモジュールのテキストソースです。`sources` が渡されたら、Denoはハッシュとすべてのモジュールを解決し、Denoの外部では解決しません。`source` が提供されない場合、Denoはルートモジュールが渡されたかのようにすべてのモジュールを解決します。Dehaリソースのすべてをキャッシュします。すべての解決済みのリソースはダイナミックインポートとして扱われローカルかリモートかによって読み込みまたはネットのパーミッションを要求します。`options` 引数は `Deno.CompilerOptions` 型のオプションのセットで、DenoがサポートするTypeScriptコンパイラオプションのサブセットです。

<!--
The method resolves with a tuple. The first argument contains any diagnostics
(syntax or type errors) related to the code. The second argument is a map where
the keys are the output filenames and the values are the content.
-->
メソッドはタプルと一緒に解決されます。最初の引数はコードに関する診断(構文や型エラー)が含まれます。2つめの引数はキーが出力ファイル名で値がコンテントのマップです。

<!-- An example of providing sources: -->
sources を提供する例です:

<!--
```ts
const [diagnostics, emitMap] = await Deno.compile("/foo.ts", {
  "/foo.ts": `import * as bar from "./bar.ts";\nconsole.log(bar);\n`,
  "/bar.ts": `export const bar = "bar";\n`,
});

assert(diagnostics == null); // ensuring no diagnostics are returned
console.log(emitMap);
```
-->
```ts
const [diagnostics, emitMap] = await Deno.compile("/foo.ts", {
  "/foo.ts": `import * as bar from "./bar.ts";\nconsole.log(bar);\n`,
  "/bar.ts": `export const bar = "bar";\n`,
});

assert(diagnostics == null); // diagnosticsが返って来ないことを確認
console.log(emitMap);
```

<!--
We would expect map to contain 4 "files", named `/foo.js.map`, `/foo.js`,
`/bar.js.map`, and `/bar.js`.
-->
マップには `/foo.js.map`、`/foo.js`、`/bar.js.map` そして `/bar.js` の4つの"ファイル"が含まれているはずです。

<!--
When not supplying resources, you can use local or remote modules, just like you
could do on the command line. So you could do something like this:
-->
リソースが供給されない場合、コマンドラインで行ったようにローカルもしくはリモートのモジュールを使うことが出来ます。これは次のようになります:

```ts
const [diagnostics, emitMap] = await Deno.compile(
  "https://deno.land/std@$STD_VERSION/examples/welcome.ts",
);
```

<!-- In this case `emitMap` will contain a `console.log()` statement. -->
この例では `emitMap` は `console.log()` 文を含んでいます。

### `Deno.bundle()`

<!--
This works a lot like `deno bundle` does on the command line. It is also like
`Deno.compile()`, except instead of returning a map of files, it returns a
single string, which is a self-contained JavaScript ES module which will include
all of the code that was provided or resolved as well as exports of all the
exports of the root module that was provided. It takes up to three arguments,
the `rootName`, optionally `sources`, and optionally `options`. The `rootName`
is the root module which will be used to generate the resulting program. This is
like module name you would pass on the command line in `deno bundle example.ts`.
The `sources` is a hash where the key is the fully qualified module name, and
the value is the text source of the module. If `sources` is passed, Deno will
resolve all the modules from within that hash and not attempt to resolve them
outside of Deno. If `sources` are not provided, Deno will resolve modules as if
the root module had been passed on the command line. All resolved resources are
treated as dynamic imports and require read or net permissions depending if
they're local or remote. Deno will also cache any of these resources. The
`options` argument is a set of options of type `Deno.CompilerOptions`, which is
a subset of the TypeScript compiler options containing the ones supported by
Deno.
-->
これはコマンドラインでの `deno bundle` の動作と似ています。ファイルのマップを返す代わりに、self-containedのJavaScript ESモジュールで提供されたり解決されたすべてのコードと提供されたルートモジュールのすべてのエクスポートを含む1つの文字列を返すことを除いて `Deno.compile()` と似ています。`rootName`、任意で `sources`、任意で `options` の最大3つの引数を取ります。`rootName` は最終的なプログラムを作成するのに使われるルートモジュールです。これは `deno bundle example.ts` でコマンドラインに渡すモジュール名のようなものです。`source` はキーが完全なモジュール名、値がモジュールのテキストソースのハッシュです。`source` が渡されたら、Denoそのハッシュの中のすべてのモジュールを解決し、Deno外部では解決しようとしません。`source` が提供されない場合コマンドラインでルートモジュールが渡されたかのようにモジュールを解決します。すべての解決されたモジュールはそれがローカル化リモートであるかに関わらずダイナミックインポートとして扱われ、読み込みやネットのパーミッションを要求します。Dehaこれらすべてのリソースをキャッシュします。`options` 引数はDenoがサポートしているものを含むTypeScriptコンパイラオプションのサブセットである `Deno.CompilerOptions` 型のオプションのセットです。

<!-- An example of providing sources: -->
ソースを提供する例:

<!--
```ts
const [diagnostics, emit] = await Deno.bundle("/foo.ts", {
  "/foo.ts": `import * as bar from "./bar.ts";\nconsole.log(bar);\n`,
  "/bar.ts": `export const bar = "bar";\n`,
});

assert(diagnostics == null); // ensuring no diagnostics are returned
console.log(emit);
```
-->
```ts
const [diagnostics, emit] = await Deno.bundle("/foo.ts", {
  "/foo.ts": `import * as bar from "./bar.ts";\nconsole.log(bar);\n`,
  "/bar.ts": `export const bar = "bar";\n`,
});

assert(diagnostics == null); // diagnosticsが返って来ないことを確認
console.log(emit);
```

<!--
We would expect `emit` to be the text for an ES module, which would contain the
output sources for both modules.
-->
`emit` はESモジュールのテキストであり両方のモジュールの出力ソースが含まれています。

<!--
When not supplying resources, you can use local or remote modules, just like you
could do on the command line. So you could do something like this:
-->
リソースを供給しない場合は、コマンドラインで出来るのと同じようにローカルやリモートのモジュールを使うことが出来ます。次のように出来ます:

```ts
const [diagnostics, emit] = await Deno.bundle(
  "https://deno.land/std@$STD_VERSION/http/server.ts",
);
```

<!--
In this case `emit` will be a self contained JavaScript ES module with all of
its dependencies resolved and exporting the same exports as the source module.
-->
この場合、`emit` はすべての依存関係を解決しソースモジュールと同じエクスポートをエクスポートするself contained JavaScript ESモジュールになります。

### `Deno.transpileOnly()`

<!--
This is based off of the TypeScript function `transpileModule()`. All this does
is "erase" any types from the modules and emit JavaScript. There is no type
checking and no resolution of dependencies. It accepts up to two arguments, the
first is a hash where the key is the module name and the value is the content.
The only purpose of the module name is when putting information into a source
map, of what the source file name was. The second argument contains optional
`options` of the type `Deno.CompilerOptions`. The function resolves with a map
where the key is the source module name supplied, and the value is an object
with a property of `source` and optionally `map`. The first is the output
contents of the module. The `map` property is the source map. Source maps are
provided by default, but can be turned off via the `options` argument.
-->
TypeScript関数 `transpileModule()` をベースにしています。この関数が行うことは モジュールの全ての型を"消去"しJavaScriptを出力します。型チェックや依存解決はありません。2つの引数を受け付けます。1つめはキーがモジュール名で値が内容のハッシュです。モジュール名はソースファイル名が何であったかの情報をソースマップに入れるときに使います。2つめの引数は型 `Deno.CompilerOptions` の任意の `options` です。関数はキーがソースモジュールで値が `source` と任意で `map` のプロパティのオブジェクトのマップで解決します。最初の出力はモジュールの内容です。`map` プロパティはソースマップです。ソースマップはデフォルトで提供されますが、`options` 引数を使って無効にすることが出来ます。

<!-- An example: -->
例:

```ts
const result = await Deno.transpileOnly({
  "/foo.ts": `enum Foo { Foo, Bar, Baz };\n`,
});

console.log(result["/foo.ts"].source);
console.log(result["/foo.ts"].map);
```

<!--
We would expect the `enum` would be rewritten to an IIFE which constructs the
enumerable, and the map to be defined.
-->
`enum` 列挙可能なものを構築するIIFEに書き換えられ、マップが定義されることを期待します。

<!-- ### Referencing TypeScript library files -->
### TypeScriptライブラリファイルの参照

<!--
When you use `deno run`, or other Deno commands which type check TypeScript,
that code is evaluated against custom libraries which describe the environment
that Deno supports. By default, the compiler runtime APIs which type check
TypeScript also use these libraries (`Deno.compile()` and `Deno.bundle()`).
-->
`deno run` やTypeScriptの型チェックを行う他のDenoコマンドを使うときを使うとき、そのコードはDenoがサポートする環境を記述したカスタムライブラリと比較して評価されます。デフォルトでは、TypeScript型チェックを行うコンパイラランタイムAPIでもこれらのライブラリ(`Deno.compile()` と `Deno.bundle()`)を使います。

<!--
But if you want to compile or bundle TypeScript for some other runtime, you may
want to override the default libraries. To do this, the runtime APIs support the
`lib` property in the compiler options. For example, if you had TypeScript code
that is destined for the browser, you would want to use the TypeScript `"dom"`
library:
-->
他のランタイムのためにTypeScriptをコンパイル化バンドルしたい場合は、デフォルトライブラリを上書きしたいかもしれません。これをするためにランタイムAPIはコンパイラオプションの `lib` プロパティでサポートしています。例えば、ブラウザ向けのTypeScriptコードを持っている場合、TypeScript `"dom"` ライブラリを使いたいと思うでしょう:

```ts
const [errors, emitted] = await Deno.compile(
  "main.ts",
  {
    "main.ts": `document.getElementById("foo");\n`,
  },
  {
    lib: ["dom", "esnext"],
  },
);
```

<!--
For a list of all the libraries that TypeScript supports, see the
[`lib` compiler option](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
documentation.
-->
TypeScriptがサポートしている全てのライブラリのリストは [`lib` コンパイラオプション](https://www.typescriptlang.org/docs/handbook/compiler-options.html) ドキュメントを見てください。

<!-- **Don't forget to include the JavaScript library** -->
**JavaScriptライブラリをインクルードすることを忘れないでください**

<!--
Just like `tsc`, when you supply a `lib` compiler option, it overrides the
default ones, which means that the basic JavaScript library won't be included
and you should include the one that best represents your target runtime (e.g.
`es5`, `es2015`, `es2016`, `es2017`, `es2018`, `es2019`, `es2020` or `esnext`).
-->
`tsc` と同じように `lib` コンパイラオプションを供給するときそれはデフォルトのものを上書きします。つまり、基本的なJavaScriptライブラリはインクルードされないのでターゲットランタイム(例、`es5`、`es2015`、`es2016`、`es2017`、`es2018`、`es2019`、`es2020`、`esnext`)をインクルードする必要があります。

<!-- #### Including the `Deno` namespace -->
#### `Deno` 名前空間のインクルード

<!--
In addition to the libraries that are provided by TypeScript, there are four
libraries that are built into Deno that can be referenced:
-->
TypeScriptで提供されいるライブラリに加えて、Denoに組み込まれているライブラリで参照できるものが4つあります:

<!--
- `deno.ns` - Provides the `Deno` namespace.
- `deno.shared_globals` - Provides global interfaces and variables which Deno
  supports at runtime that are then exposed by the final runtime library.
- `deno.window` - Exposes the global variables plus the Deno namespace that are
  available in the Deno main worker and is the default for the runtime compiler
  APIs.
- `deno.worker` - Exposes the global variables that are available in workers
  under Deno.
-->
- `deno.ns` - `Deno` 名前空間を提供します。
- `deno.shared_globals` - Denoが最終的なランタイムライブラリで公開されるランタイムでサポートするグローバルインターフェースと変数を提供します。
- `deno.window` - グローバル変数とDenoメインワーカーで利用可能なDeno名前空間を公開し、ランタイムコンパイラAPIのデフォルトとなります。
- `deno.worker` - Denoのもとのワーカーで利用可能なグローバル変数を公開します。

<!--
So to add the Deno namespace to a compilation, you would include the `deno.ns`
lib in the array. For example:
-->
そのためDeno名前空間をコンパイルに追加するには `deno.ns` libを配列でインクルードしてください。例えば:

```ts
const [errors, emitted] = await Deno.compile(
  "main.ts",
  {
    "main.ts": `document.getElementById("foo");\n`,
  },
  {
    lib: ["dom", "esnext", "deno.ns"],
  },
);
```

<!--
**Note** that the Deno namespace expects a runtime environment that is at least
ES2018 or later. This means if you use a lib "lower" than ES2018 you will get
errors logged as part of the compilation.
-->
Deno名前空間はランタイム環境がES2018以降であると期待することに**注意**してください。つまり、ES2018より"低い"libを使うとコンパイルの一部としてエラーが記録されます。

<!-- #### Using the triple slash reference -->
#### トリプルスラッシュリファレンス

<!--
You do not have to specify the `lib` in the compiler options. Deno also supports
[the triple-slash reference to a lib](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-lib-)
which can be embedded in the contents of the file. For example, if you have a
`main.ts` like:
-->
コンパイラオプションで `lib` を指定する必要はありません。Denoはファイルの中に埋め込むことが出来る [libへのトリプルスラッシュリファレンス](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-lib-) もサポートします。例えば、`main.ts` では:

```ts
/// <reference lib="dom" />

document.getElementById("foo");
```

<!-- It would compile without errors like this: -->
これは以下のようなエラーがなくコンパイルします:

```ts
const [errors, emitted] = await Deno.compile("./main.ts", undefined, {
  lib: ["esnext"],
});
```

<!--
**Note** that the `dom` library conflicts with some of the default globals that
are defined in the default type library for Deno. To avoid this, you need to
specify a `lib` option in the compiler options to the runtime compiler APIs.
-->
`dom` ライブラリはDenoのデフォルト型ライブラリで定義されているデフォルトグローバルと競合することに**注意**してください。これを避けるにはランタイムコンパイラAPIのコンパイラオプションで `lib` オプションを指定する必要があります。
