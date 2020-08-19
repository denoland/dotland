<!-- # Deno Style Guide -->
# Denoスタイルガイド

<!-- ## Table of Contents -->
## 目次

<!-- ## Copyright Headers -->
## コピーライトヘッダー

<!-- Most modules in the repository should have the following copyright header: -->
リポジトリ内のほとんどのモジュールはルギのコピーライトヘッダーを持つべきです:

```ts
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
```

<!--
If the code originates elsewhere, ensure that the file has the proper copyright
headers. We only allow MIT, BSD, and Apache licensed code.
-->
コードが他の場所に由来する場合は、ファイルに適切なコピーライトヘッダーがあるか確認してください。MIT、BSDそしてApacheライセンスのコードのみ許可しています。

<!-- ## Use underscores, not dashes in filenames. -->
## ファイル名にはダッシュではなくアンダースコアを使ってください。

<!-- Example: Use `file_server.ts` instead of `file-server.ts`. -->
例: `file-server.ts` ではなく `file_server.ts` を使ってください。

<!-- ## Add tests for new features. -->
## 新しい機能へのテストの追加。

<!--
Each module should contain or be accompanied by tests for its public
functionality.
-->
角モジュールはその公開機能のテストを含んでいるか、テストを伴っていなければいけません。

<!-- ## TODO Comments -->
## TODOコメント

<!--
TODO comments should usually include an issue or the author's github username in
parentheses. Example:
-->
TODOコメントはissueや書き込んだ人のgithubユーザー名をカッコ内に含んでください。例:

```ts
// TODO(ry): Add tests.
// TODO(#123): Support Windows.
// FIXME(#349): Sometimes panics.
```

<!-- ## Meta-programming is discouraged. Including the use of Proxy. -->
## プロキシの使用を含み、メタプログラミングはおすすめしません。

<!-- Be explicit even when it means more code. -->
より多くのコードを意味する場合でも明示的にしてください。

<!--
There are some situations where it may make sense to use such techniques, but in
the vast majority of cases it does not.
-->
メタプログラミングのようなテクニックを使うことに意味がある場合もありますが、ほとんどの場合はそうではありません。

<!-- ## Inclusive code -->
## インクルーシブコード

<!--
Please follow the guidelines for inclusive code outlined at
https://chromium.googlesource.com/chromium/src/+/master/styleguide/inclusive_code.md.
-->
https://chromium.googlesource.com/chromium/src/+/master/styleguide/inclusive_code.md にあるガイドラインに従ってください。

## Rust

<!-- Follow Rust conventions and be consistent with existing code. -->
Rust規約に従い、既存のコードと一致させてください。

## Typescript

<!--
The TypeScript portions of the codebase include `cli/js` for the built-ins and
the standard library `std`.
-->
コードベースのTypeScriptの部分にはビルトインのための `cli/js` と標準ライブラリの `std` が含まれています。

<!-- ### Use TypeScript instead of JavaScript. -->
### JavaScriptの代わりにTypeScriptを使ってください。

<!-- ### Use the term "module" instead of "library" or "package". -->
### "library" や "package" の用語の代わりに "module" を使ってください

<!--
For clarity and consistency avoid the terms "library" and "package". Instead use
"module" to refer to a single JS or TS file and also to refer to a directory of
TS/JS code.
-->
明快さと一貫性のために"library"や"package"という用語を避けてください。代わりに1つのJSやTSファイルやTS/JSコードのディレクトリを指す場合"module"を使ってください。

<!-- ### Do not use the filename `index.ts`/`index.js`. -->
### ファイル名に `index.ts`/`index.js` を使わないでください。

<!--
Deno does not treat "index.js" or "index.ts" in a special way. By using these
filenames, it suggests that they can be left out of the module specifier when
they cannot. This is confusing.
-->
Denoは"index.js"や"index.ts"を特別なものとして扱いません。これらのファイル名を使用することで、モジュール指定子を残せない場合これが残せるように示唆しています。これは混乱を招きます。

<!--
If a directory of code needs a default entry point, use the filename `mod.ts`.
The filename `mod.ts` follows Rust’s convention, is shorter than `index.ts`, and
doesn’t come with any preconceived notions about how it might work.
-->
コードのディレクトリがデフォルトエントリーポイントが必要なら `mod.ts` を使用してください。ファイル名 `mod.ts` はRustの監修に従っていて、`inde.ts` より短いです。そして、それがどのように動作するか先入観を持っていません。

<!-- ### Exported functions: max 2 args, put the rest into an options object. -->
### エクスポートされた関数: 最大で2つの引数、残りはオプションオブジェクトに入れてください。

<!-- When designing function interfaces, stick to the following rules. -->
関数インターフェースを設計するときは以下のルールに従ってください。

<!--
1. A function that is part of the public API takes 0-2 required arguments, plus
   (if necessary) an options object (so max 3 total).

2. Optional parameters should generally go into the options object.

   An optional parameter that's not in an options object might be acceptable if
   there is only one, and it seems inconceivable that we would add more optional
   parameters in the future.

3. The 'options' argument is the only argument that is a regular 'Object'.

   Other arguments can be objects, but they must be distinguishable from a
   'plain' Object runtime, by having either:

   - a distinguishing prototype (e.g. `Array`, `Map`, `Date`, `class MyThing`)
   - a well-known symbol property (e.g. an iterable with `Symbol.iterator`).

   This allows the API to evolve in a backwards compatible way, even when the
   position of the options object changes.
-->
1. 公開APIの関数は0-2個の必須引数と(必要なら)オプションオブジェクト(つまり、最大3つです)をとってください。

2. オプションパラメータは一般的にはオプションオブジェクトの中に入ってるはずです。

   オプションオブジェクトでないオプションパラメーターは1つだけなら許容できるかもしれませんし、将来的にオプションパラメーターを増やすことは考えていないように思います。
   

3. '任意'の引数は普通の'オブジェクトである唯一の引数です。

   ほかの引数はオブジェクトに出来ますが、次のどちらかを持つことで'通常'のオブジェクトランタイムと区別出来る必要があります:

   - 特徴的なプロトタイプ(例、`Array`、`Map`、`Date`、`class MyThing`)
   - よく知られたシンボルプロパティ(例、`Symbol.iterator` でイレテータブルなもの)。

   これによりオプションオブジェクトの位置が変わっても、APIに後方互換をもたせることが出来ます。

<!--
```ts
// BAD: optional parameters not part of options object. (#2)
export function resolve(
  hostname: string,
  family?: "ipv4" | "ipv6",
  timeout?: number,
): IPAddress[] {}

// GOOD.
export interface ResolveOptions {
  family?: "ipv4" | "ipv6";
  timeout?: number;
}
export function resolve(
  hostname: string,
  options: ResolveOptions = {},
): IPAddress[] {}
```
-->
```ts
// 悪い例: オプションパラメーターがオプションオブジェクトの一部ではありません。(#2)
export function resolve(
  hostname: string,
  family?: "ipv4" | "ipv6",
  timeout?: number,
): IPAddress[] {}

// 良い例。
export interface ResolveOptions {
  family?: "ipv4" | "ipv6";
  timeout?: number;
}
export function resolve(
  hostname: string,
  options: ResolveOptions = {},
): IPAddress[] {}
```

<!--
```ts
export interface Environment {
  [key: string]: string;
}

// BAD: `env` could be a regular Object and is therefore indistinguishable
// from an options object. (#3)
export function runShellWithEnv(cmdline: string, env: Environment): string {}

// GOOD.
export interface RunShellOptions {
  env: Environment;
}
export function runShellWithEnv(
  cmdline: string,
  options: RunShellOptions,
): string {}
```
-->
```ts
export interface Environment {
  [key: string]: string;
}

// 悪い例: `env` は通常のオブジェクトであるためオプションオブジェクトと見分けが付きません。(#3)
export function runShellWithEnv(cmdline: string, env: Environment): string {}

// 良い例。
export interface RunShellOptions {
  env: Environment;
}
export function runShellWithEnv(
  cmdline: string,
  options: RunShellOptions,
): string {}
```

<!--
```ts
// BAD: more than 3 arguments (#1), multiple optional parameters (#2).
export function renameSync(
  oldname: string,
  newname: string,
  replaceExisting?: boolean,
  followLinks?: boolean,
) {}

// GOOD.
interface RenameOptions {
  replaceExisting?: boolean;
  followLinks?: boolean;
}
export function renameSync(
  oldname: string,
  newname: string,
  options: RenameOptions = {},
) {}
```
-->
```ts
// 悪い例: 3つより多い引数(#1)で、複数のオプションパラメーターがあります(#2)。
export function renameSync(
  oldname: string,
  newname: string,
  replaceExisting?: boolean,
  followLinks?: boolean,
) {}

// 良い例。
interface RenameOptions {
  replaceExisting?: boolean;
  followLinks?: boolean;
}
export function renameSync(
  oldname: string,
  newname: string,
  options: RenameOptions = {},
) {}
```

<!--
```ts
// BAD: too many arguments. (#1)
export function pwrite(
  fd: number,
  buffer: TypedArray,
  offset: number,
  length: number,
  position: number,
) {}

// BETTER.
export interface PWrite {
  fd: number;
  buffer: TypedArray;
  offset: number;
  length: number;
  position: number;
}
export function pwrite(options: PWrite) {}
```
-->
```ts
// 悪い例: 引数が多すぎです。(#1)
export function pwrite(
  fd: number,
  buffer: TypedArray,
  offset: number,
  length: number,
  position: number,
) {}

// より良い例。
export interface PWrite {
  fd: number;
  buffer: TypedArray;
  offset: number;
  length: number;
  position: number;
}
export function pwrite(options: PWrite) {}
```

<!-- ### Minimize dependencies; do not make circular imports. -->
### 依存関係の最小化; 循環インポートは作らないでください。

<!--
Although `cli/js` and `std` have no external dependencies, we must still be
careful to keep internal dependencies simple and manageable. In particular, be
careful not to introduce circular imports.
-->
`cli/js` と `std` は外部依存関係を持っていませんが、内部依存関係をシンプルで管理できるものに保つことに注意を払う必要があります。特に、循環インポートをしないように気をつけてください。

<!-- ### If a filename starts with an underscore: `_foo.ts`, do not link to it. -->
### `_foo.ts` のようにファイル名がアンダースコアから始まる場合、それにリンクしないでください。

<!--
Sometimes there may be situations where an internal module is necessary but its
API is not meant to be stable or linked to. In this case prefix it with an
underscore. By convention, only files in its own directory should import it.
-->
場合によっては、内部モジュールが必要であるのにそのAPIが安定版でない、あるいはリンクされていないという状況があるかおしれません。このときはアンダースコアでプレフィックスしてください。規則では、独自のディレクトリ内のファイルのみがインポートされます。

<!-- ### Use JSDoc for exported symbols. -->
### エクスポートされたシンボルにはJSDocを使ってください。

<!--
We strive for complete documentation. Every exported symbol ideally should have
a documentation line.
-->
私達は完全なドキュメント化を目指しています、すべてのエクスポートされたシンボルは理想的にはドキュメントラインを持っているべきです。

<!-- If possible, use a single line for the JS Doc. Example: -->
可能ならJS Docに1行を使ってください。例:

```ts
/** foo does bar. */
export function foo() {
  // ...
}
```

<!--
It is important that documentation is easily human readable, but there is also a
need to provide additional styling information to ensure generated documentation
is more rich text. Therefore JSDoc should generally follow markdown markup to
enrich the text.
-->
ドキュメントが人に読みやすいことは重要ですが、生成されたドキュメントがより立地なテキストであることを保証するために追加のスタイリング情報を提供する必要もあります。そのためJSDocはテキストを立地にするためmarkdownマークアップに従います。

<!-- While markdown supports HTML tags, it is forbidden in JSDoc blocks. -->
markdownではHTMLタグをサポートしていますが、JSDocでは禁止です。

<!--
Code string literals should be braced with the back-tick (\`) instead of quotes.
For example:
-->
コード文字リテラルはクオートの代わりにグレイヴアクセント(\`)を使ってください。例えば:

```ts
/** Import something from the `deno` module. */
```

<!--
Do not document function arguments unless they are non-obvious of their intent
(though if they are non-obvious intent, the API should be considered anyways).
Therefore `@param` should generally not be used. If `@param` is used, it should
not include the `type` as TypeScript is already strongly typed.
-->
関数の引数がその意図が明らかでない場合を除いてドキュメントにしてはいけません(意図が明らかでない場合いずれにしてもAPIを考え直す必要がありますが)。そのため `@param` は一般的には使われません。もし、`@param` が使われている場合、TypeScriptは強力な片付けを持っているため `type` を含めるべきではありません。

<!--
```ts
/**
 * Function with non obvious param.
 * @param foo Description of non obvious parameter.
 */
```
-->
```ts
/**
 * 明らかなparamでないものを持っている関数
 * @param foo 明らかでないパラメーターの説明。
 */
```

<!--
Vertical spacing should be minimized whenever possible. Therefore single line
comments should be written as:
-->
縦方向のスペースは出来る限り最小化すべきです。そのため、一行コメントは次のように書かれるべきです:

<!--
```ts
/** This is a good single line JSDoc. */
```
-->
```ts
/** これは良い一行のJSDocです。 */
```

<!-- And not -->
このようにではなく

<!--
```ts
/**
 * This is a bad single line JSDoc.
 */
```
-->
```ts
/**
 * これは悪い一行のJSDocです。
 */
```

<!--
Code examples should not utilise the triple-back tick (\`\`\`) notation or tags.
They should just be marked by indentation, which requires a break before the
block and 6 additional spaces for each line of the example. This is 4 more than
the first column of the comment. For example:
-->
コード例はトリプルグレイヴアクセント(\`\`\`)の表記法やタグを使うべきではありません。インデントで記されるべきであり、ブロックの前に改行よ、各行に6つの追加スペースを必要とします。これはコメントの最初の列より4つ多いです。例えば:

<!--
```ts
/** A straight forward comment and an example:
 *
 *       import { foo } from "deno";
 *       foo("bar");
 */
```
-->
```ts
/** わかりやすいコメントと一例:
 *
 *       import { foo } from "deno";
 *       foo("bar");
 */
```

<!--
Code examples should not contain additional comments. It is already inside a
comment. If it needs further comments it is not a good example.
-->
個ーどれは追加のコメントを含めるべきではありません。すでにコメントの中です。もし更にコメントが必要ならそれは良い例ではありません。

<!-- ### Each module should come with a test module. -->
### それぞれのモジュールにはテストモジュールを付属させてください。

<!--
Every module with public functionality `foo.ts` should come with a test module
`foo_test.ts`. A test for a `cli/js` module should go in `cli/js/tests` due to
their different contexts, otherwise it should just be a sibling to the tested
module.
-->
公開機能をもつすべてのモジュール `foo.ts` はテストモジュール `foo_test.ts` と一緒である必要があります。状況が違うため`cli/js` のためのテストモジュールは `cli/js/tests` にあるべきでありますが、それ以外の場合はテストモジュールと同じ階層にあるべきです。

<!-- ### Unit Tests should be explicit. -->
### ユニットテストは明示的であるべきです。

<!--
For a better understanding of the tests, function should be correctly named as
its prompted throughout the test command. Like:
-->
テストをより良く理解するために、関数はテストコマンドを通して表示されるため正しく名付けられるべきです。例えば:

```
test myTestFunction ... ok
```

<!-- Example of test: -->
テストの例:

```ts
import { assertEquals } from "https://deno.land/std@$STD_VERSION/testing/asserts.ts";
import { foo } from "./mod.ts";

Deno.test("myTestFunction", function () {
  assertEquals(foo(), { bar: "bar" });
});
```

<!-- ### Top level functions should not use arrow syntax. -->
### トップレベル関数はアロー構文を使わないでください。

<!--
Top level functions should use the `function` keyword. Arrow syntax should be
limited to closures.
-->
トップレベル関数は `function` キーワードを使うべきです。アロー構文はクロージャに限定すべきです。

<!-- Bad -->
悪い例

```ts
export const foo = (): string => {
  return "bar";
};
```

<!-- Good -->
良い例

```ts
export function foo(): string {
  return "bar";
}
```

### `std`

<!-- #### Do not depend on external code. -->
#### 外部のコードに依存しないでください。

<!--
`https://deno.land/std/` is intended to be baseline functionality that all Deno
programs can rely on. We want to guarantee to users that this code does not
include potentially unreviewed third party code.
-->
`https://deno.land/std/` はすべてのDenoプログラムが使う基本機能であるように意図されています。私達はこのコードにはユーザーにレビューされていない可能性があるサードパーティコードを含んでないことを保証したいです。

<!-- #### Document and maintain browser compatiblity. -->
#### ブラウザ互換をドキュメントにし維持する。

<!--
If a module is browser compatible, include the following in the JSDoc at the top
of the module:
-->
モジュールがブラウザ互換であれば、次のJSDocをモジュールの最初に含めてください。

```ts
/** This module is browser compatible. */
```

<!--
Maintain browser compatibility for such a module by either not using the global
`Deno` namespace or feature-testing for it. Make sure any new dependencies are
also browser compatible.
-->
グローバル `Deno` 名前空間を使用しないか機能テストを行うことでこのようなモジュールのブラウザ互換を維持してください。新しい依存関係もブラウザ互換であることを確認してください。
